from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.content, name='index'),
	url(r'^consent', views.content, name='consent'),
	url(r'^tutorial', views.content, name='tutorial'),
	url(r'^policy', views.workspace, name='policy'),
	url(r'^rank', views.rank, name='rank'),
	url(r'^gen', views.workspace, name='generator'),
	url(r'^end', views.content, name='end_survey'),
]
