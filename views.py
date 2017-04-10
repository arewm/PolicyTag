from django.shortcuts import render
from django.http import JsonResponse

from .models import Tag

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
    classes = Tag.objects.values('tag_class').distinct().order_by('tag_class')
    tag_list = []
    for c in classes:
        tags = Tag.objects.filter(tag_class=c['tag_class']).order_by('text')
        for t in tags:
            t.tag_id = 'a{}'.format(t.tag_id)
        tag_list.append((c['tag_class'], tags))
    #tag_list = Tag.objects.order_by('tag_class', 'text')
    context = {'classes': classes,'tags': tag_list, 'ids': ''}
    return render(request, 'survey/policy.html', context)

def submit_policy(request):
    context = {'text': request.POST}
    return JsonResponse(context)
    #return render(request, 'survey/index.html', context)

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
    context = {}
    return render(request, 'survey/generate.html', context)

def survey(request):
    context = {}
    return render(request, 'survey/survey.html', context)
    #return HttpResponse('Hello, you are at content. {}'.format(request))

def end(request):
    context = {}
    return render(request, 'survey/end.html', context)
