from django.shortcuts import render
from django.http import HttpResponse

from .models import Tag

# Create your views here.

def index(request):
    context = {}
    return render(request, 'survey/index.html', context)
    #return HttpResponse('Hello, world. You\'re at the index. {}'.format(request))

def tutorial(request):
    context = {}
    return render(request, 'survey/tutorial.html', context)

def policy(request):
    tag_list = Tag.objects.order_by('text')
    context = {'tags': tag_list}
    return render(request, 'survey/policy.html', context)

def rank(request):
    tag_list = Tag.objects.order_by('text')
    insert_list = []
    class_dict = {0: 'first', 1: 'second', 2: 'third'}
    i=0
    for t in tag_list:
        insert_list.append((class_dict[i%3], t))
        i += 1
    context = {'tags': insert_list}
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
