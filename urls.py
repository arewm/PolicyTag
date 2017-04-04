from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^consent', views.index, name='consent'),
	url(r'^tutorial', views.tutorial, name='tutorial'),
	url(r'^policy', views.policy, name='policy'),
	url(r'^gen', views.gen, name='generator'),
	url(r'^rank', views.rank, name='rank'),
	url(r'^end', views.end, name='end_survey'),
]
