from django.shortcuts import render
from django.http import HttpResponse

from .models import Tag

def index(request):
    return HttpResponse('Hello, world. You\'re at the index. {}'.format(request))

def content(request):
    return HttpResponse('Hello, you are at content. {}'.format(request))

def workspace(request):
    tag_list = Tag.objects.order_by('text')
    context = {'tags': tag_list}
    return render(request, 'survey/policy.html', context)

def rank(request):
    return HttpResponse('Hellow, you are at rank. {}'.format(request))
# Create your views here.
