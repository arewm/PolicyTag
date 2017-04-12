import sys

from django.shortcuts import render
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

from .models import Tag, Person, Action, PolicyAction, Policies, PolicyTag

import re


# Create your views here.

def index(request):
    context = {}
    return render(request, 'survey/index.html', context)
    #return HttpResponse('Hello, world. You\'re at the index. {}'.format(request))

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
        tags = Tag.objects.filter(tag_class=c['tag_class']).order_by('text')
        for t in tags:
            t.tag_id = 't{}'.format(t.tag_id)
        tag_list.append((c['tag_class'], tags))
    #tag_list = Tag.objects.order_by('tag_class', 'text')
    context = {'person': p.person_id, 'actions': action_list, 'classes': classes,'tags': tag_list, 'ids': ''}
    return render(request, 'survey/policy.html', context)

def submit_policy(request):
    print(request, file=sys.stderr)
    print(request.POST, file=sys.stderr)
    p = Person.objects.get(person_id=request.POST['person'])
    new_policy = Policies(owner=p, time_to_generate=request.POST['time'])

    # get GUIDs by removing the first character
    print(request.POST.get('action', []), file=sys.stderr)
    action_list = request.POST.get('action', [])
    for a in Action.objects.all():
        # Create the necessary PolicyAction if it does not exist
        allowed = str(a.action_id) in action_list
        try:
            act = PolicyAction.objects.get(action_id=a, allow=allowed)
        except ObjectDoesNotExist:
            act = PolicyAction(action_id=a, allow=allowed)
            act.save()
        # add the policy actions to the new policy
        new_policy.actions.add(act)

    my_tags = PolicyTag.objects.get(owner=p)
    for t in request.POST['tag']:
        tag = Tag.objects.get(tag_id=t[1:])[0]

        try:
            pt = my_tags.filter(tag=tag).get()
        except ObjectDoesNotExist:
            pt = PolicyTag(tag=tag, owner=p)
            pt.save()
        new_policy.tags.add(pt)
    new_policy.save()

    response = {}
    return JsonResponse(response)

def custom_tag(request):
    response = {'id': 'a_test_tag_id', 'text': request.POST['tag'], 'category': request.POST['category']}
    return JsonResponse(response)


def rank(request):
    tag_list = Tag.objects.order_by('tag_class', 'text')
    for t in tag_list:
        t.tag_id = 'a{}'.format(t.tag_id)
    ids = re.sub(r'[\'"]', '',str(['#{}'.format(t.tag_id) for t in tag_list])[1:-1])
    #ids = ['#{}'.format(t.tag_id) for t in tag_list]
    #ids.extend(['#drag1', '#drag2', '#drag3', '#drag4'])
    #ids = ['#drag1', '#drag2', '#drag3', '#drag4', '#test']
    #ids = str(ids)[1:-1]
    #ids = re.sub(r'[\'"]', '', str(ids)[1:-1])
    #ids = [t.tag_id for t in tag_list]
    insert_list = []
    class_dict = {0: 'first', 1: 'second', 2: 'third', 3: 'fourth'}
    i=0
    for t in tag_list:
        insert_list.append((class_dict[i%4], t))
        i += 1
    context = {'tags': insert_list, 'ids':ids}
    return render(request, 'survey/rank.html', context)
    #return HttpResponse('Hellow, you are at rank. {}'.format(request))

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
      #tag_list = Tag.objects.order_by('tag_class', 'text')
    context = {'person': p.person_id, 'actions': action_list, 'ids': ''}
    return render(request, 'survey/generate.html', context)

def survey(request):
    context = {}
    return render(request, 'survey/survey.html', context)
    #return HttpResponse('Hello, you are at content. {}'.format(request))

def end(request):
    context = {}
    return render(request, 'survey/end.html', context)
