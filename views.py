from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse, Http404
from django.db.models import Q

from .models import Tag, Person, Action, PolicyAction, Policies, PolicyTag

import re


def index(request):
    context = {}
    return render(request, 'survey/index.html', context)


def tutorial(request):
    context = {}
    return render(request, 'survey/tutorial.html', context)


def policy(request):
    p = request.GET.get('person', None)

    if p is None:
        p = Person.objects.get(person_id='4b81dbb5-3e78-4bb0-a2dd-bf1052368669')
    else:
        expert = request.GET.get('e', '').lower() == 't'
        consent = request.GET.get('c', '').lower() == 'c'
        p = Person(expert_class=expert, consent_accepted=consent)
        p.save()
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
    # tag_list = Tag.objects.order_by('tag_class', 'text')
    context = {'person': p.person_id, 'actions': action_list, 'classes': classes, 'tags': tag_list, 'ids': ''}
    return render(request, 'survey/policy.html', context)


def submit_policy(request):
    p = Person.objects.get(person_id=request.POST['person'])
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

    return HttpResponse('')


def custom_tag(request):
    # create a custom tag as long as it does not already exist as a system or this-user tag
    response = {'new': 'false', 'category': request.POST['category']}
    p = Person.objects.get(person_id=request.POST['person'])
    try:
        get_object_or_404(Tag, text=request.POST['tag'].strip(), tag_class=request.POST['category'], creator=None)
    except Http404:
        # we could not find the tag as a system tag
        try:
            get_object_or_404(Tag, text=request.POST['tag'].strip(), tag_class=request.POST['category'], creator=p)
        except Http404:
            # we could not find the tag in those owned by this user
            tag = Tag(text=request.POST['tag'].strip(), tag_class=request.POST['category'], custom=True, creator=p)
            tag.save()
            response['new'] = 'true'
            response['id'] = 't{}'.format(tag.tag_id)
            response['text'] = tag.text
    return JsonResponse(response)


def custom_tag_order(tag):
    return '{} {}'.format(tag.tag_class, tag.text)


def rank(request):
    p = request.GET.get('person', '4b81dbb5-3e78-4bb0-a2dd-bf1052368669')
    p = Person.objects.get(person_id=p)

    # tag_list = Tag.objects.order_by('tag_class', 'text')
    #tag_list = [pt.tag for pt in PolicyTag.objects.filter(Q(owner=None) | Q(owner=p))]
    tag_list = [pt.tag for pt in PolicyTag.objects.filter(owner=p)]
    tag_list.sort(key=custom_tag_order)
    for t in tag_list:
        t.tag_id = 'a{}'.format(t.tag_id)
    ids = re.sub(r'[\'"]', '', str(['#{}'.format(t.tag_id) for t in tag_list])[1:-1])
    # ids = ['#{}'.format(t.tag_id) for t in tag_list]
    # ids.extend(['#drag1', '#drag2', '#drag3', '#drag4'])
    # ids = ['#drag1', '#drag2', '#drag3', '#drag4', '#test']
    # ids = str(ids)[1:-1]
    # ids = re.sub(r'[\'"]', '', str(ids)[1:-1])
    # ids = [t.tag_id for t in tag_list]
    insert_list = []
    class_dict = {0: 'first', 1: 'second', 2: 'third', 3: 'fourth'}
    i = 0
    for t in tag_list:
        insert_list.append((class_dict[i % 4], t))
        i += 1
    context = {'person': p.person_id, 'tags': insert_list, 'ids': ids}
    return render(request, 'survey/rank.html', context)


def save_rank(request):
    p = request.POST.get('person', '4b81dbb5-3e78-4bb0-a2dd-bf1052368669')
    p = Person.objects.get(person_id=p)

    tag = get_object_or_404(Tag, tag_id=request.POST.get('tag')[1:])

    my_tag = get_object_or_404(PolicyTag, owner=p, tag=tag)
    my_tag.priority = int(request.POST.get('rank'))
    my_tag.save()
    return HttpResponse('')


def gen(request):
    p = request.GET.get('person', None)

    if p is None:
            p = Person.objects.get(person_id='4b81dbb5-3e78-4bb0-a2dd-bf1052368669')
    else:
        expert = request.GET.get('e', '').lower() == 't'
        consent = request.GET.get('c', '').lower() == 'c'
        p = Person(expert_class=expert, consent_accepted=consent)
        p.save()
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
