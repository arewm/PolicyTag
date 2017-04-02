from django.shortcuts import render
from django.http import HttpResponse

def index(request):
	return HttpResponse('Hello, world. You\'re at the index. {}'.format(request))

def content(request):
	return HttpResponse('Hello, you are at content. {}'.format(request))

def workspace(request):
	return HttpResponse('Hello, you are at workspace. {}'.format(request))

def rank(request):
	return HttpResponse('Hellow, you are at rank. {}'.format(request))
# Create your views here.
