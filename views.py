from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse, Http404
from django.db.models import Q

from .models import Tag, Person, Action, PolicyAction, Policies, PolicyTag

from random import random
import re

test_id = '4b81dbb5-3e78-4bb0-a2dd-bf1052368669'
is_test = True


def index(request):
    context = {}
    return render(request, 'survey/index.html', context)


def consent(request):
    return render(request, 'survey/consent.html', {})


def tutorial(request):
    # If they did not accept the consent, redirect them to an end message.
    consent = request.POST.get('agree', 'no') == 'yes'
    if is_test:
        consent = True
    if not consent:
        return redirect('end')
    # Create the user for this instance. Randomly assign them to expert or non-expert.
    expert = random() < 0.5
    if is_test:
        p = Person.objects.get(person_id=test_id)
    else:
        p = Person(expert_class=expert, consent_accepted=consent)
        p.save()

    # Make sure we set some kind of cookie here to determine if they have completed the survey.
    #   maybe allow the user to pick up where they left off...? probably not now.
    context = {'expert': expert, 'person': p.id}
    return render(request, 'survey/tutorial.html', context)


def policy(request, default_person='invalid_person_id'):
    # Determine who is creating policies
    p_id = request.POST.get('person', default_person)
    if is_test:
        p = Person.objects.get(person_id=test_id)
    else:
        p = get_object_or_404(Person, person_id=p_id)


    is_expert = bool(request.GET.get('e', 0))
    policy_sugg_owner = None if p.expert_class else p
    if is_test:
        policy_sugg_owner = None if is_expert else p

    # Get all system defaults to populate the page with
    actions = Action.objects.all()
    action_list = []
    for a in actions:
        action_list.append(('a{}'.format(a.action_id), a.text))
    classes = Tag.objects.values('tag_class').distinct().order_by('tag_class')
    tag_list = []
    for c in classes:
        tags = Tag.objects.filter(tag_class=c['tag_class']).filter(creator=None).order_by('text')
        for t in tags:
            t.tag_id = 't{}'.format(t.tag_id)
        tag_list.append((c['tag_class'], tags))
    # Get the suggested policies if we want to display them.
    expert_policies = Policies.objects.filter(owner=policy_sugg_owner)
    sugg_policies = []
    for e in expert_policies:
        this_policy = []
        for t in e.tags.all():
            this_policy.append((t.tag.tag_class, 't{}'.format(t.tag.tag_id), t.tag.text))
        sugg_policies.append(('p{}'.format(e.policy_id), this_policy))
    # make the context for generating the page
    context = {'person': p.person_id, 'actions': action_list, 'classes': classes, 'tags': tag_list, 'policies': sugg_policies}
    return render(request, 'survey/policy.html', context)


def submit_policy(request):
    p = get_object_or_404(Person, person_id=request.POST['person'])
    new_policy = Policies(owner=p, time_to_generate=request.POST['time'])

    # get GUIDs by removing the first character
    action_list = [a[1:] for a in request.POST.getlist('action')]
    for a in Action.objects.all():
        # Create the necessary PolicyAction if it does not exist
        allowed = str(a.action_id) in action_list
        try:
            act = get_object_or_404(PolicyAction, action_id=a, allow=allowed)
        except Http404:
            act = PolicyAction(action_id=a, allow=allowed)
            act.save()
        # add the policy actions to the new policy
        new_policy.actions.add(act)

    my_tags = PolicyTag.objects.filter(owner=p)
    for t in request.POST.getlist('tag'):
        tag = get_object_or_404(Tag, tag_id=t[1:])

        if not my_tags.filter(tag=tag):
            pt = PolicyTag(tag=tag, owner=p)
            pt.save()
        else:
            pt = my_tags.filter(tag=tag).get()
        new_policy.tags.add(pt)
    new_policy.save()

    response = {'id': new_policy.policy_id, 'num': Policies.objects.count()}
    return JsonResponse(response)


def remove_policy(request):
    # do something like this to see if the tags are associated with any other policies...
    # if user.partner_set.filter(slug=requested_slug).exists():
    # use .delete()
    pass


def custom_tag(request):
    # create a custom tag as long as it does not already exist as a system or this-user tag
    response = {'new': 'false', 'category': request.POST['category']}
    p = get_object_or_404(Person, person_id=request.POST['person'])
    if not Tag.objects.filter(Q(text=request.POST['tag'].strip()) &
                              Q(tag_class=request.POST['category']) &
                              (Q(creator=None) | Q(creator=p))):
        # we cannot find a system or user-created tag with the text and class provided
        tag = Tag(text=request.POST['tag'].strip(), tag_class=request.POST['category'], custom=True, creator=p)
        tag.save()
        response['new'] = 'true'
        response['id'] = 't{}'.format(tag.tag_id)
        response['text'] = tag.text
    return JsonResponse(response)


def custom_tag_order(tag):
    return '{} {}'.format(tag.tag_class, tag.text)


def rank(request):
    p_id = request.POST.get('person', test_id)
    p = get_object_or_404(Person, person_id=p_id)

    tag_list = [pt.tag for pt in PolicyTag.objects.filter(owner=p)]
    tag_list.sort(key=custom_tag_order)
    for t in tag_list:
        t.tag_id = 'a{}'.format(t.tag_id)
    ids = re.sub(r'[\'"]', '', str(['#{}'.format(t.tag_id) for t in tag_list])[1:-1])
    insert_list = []
    class_dict = {0: 'first', 1: 'second', 2: 'third', 3: 'fourth'}
    i = 0
    for t in tag_list:
        insert_list.append((class_dict[i % 4], t))
        i += 1
    context = {'person': p_id, 'tags': insert_list, 'ids': ids, 'number': len(tag_list)}
    context['end_div'] = '' if len(tag_list) % 4 == 0 else '</div>'
    return render(request, 'survey/rank.html', context)


def save_rank(request):
    import sys
    print(request.POST, file=sys.stderr)
    p_id = request.POST.get('person', test_id)
    p = get_object_or_404(Person, person_id=p_id)

    tag = get_object_or_404(Tag, tag_id=request.POST.get('tag')[1:])

    my_tag = get_object_or_404(PolicyTag, owner=p, tag=tag)
    my_tag.priority = int(request.POST.get('rank', '-1'))
    my_tag.save()
    return HttpResponse('')


def gen(request):
    p_id = request.GET.get('person', None)

    if p_id is None:
        p = Person.objects.get(person_id=test_id)
    else:
        p = get_object_or_404(Person, person_id=p_id)

    actions = Action.objects.all()
    action_list = []
    for a in actions:
        action_list.append(('a{}'.format(a.action_id), a.text))
    # tag_list = Tag.objects.order_by('tag_class', 'text')
    context = {'person': p.person_id, 'actions': action_list, 'ids': ''}
    return render(request, 'survey/generate.html', context)


def survey(request):
    context = {}
    return render(request, 'survey/survey.html', context)


def end(request):
    context = {}
    return render(request, 'survey/end.html', context)
