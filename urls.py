from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^consent', views.index, name='consent'),
	url(r'^tutorial', views.tutorial, name='tutorial'),
	url(r'^policy', views.policy, name='policy'),
    url(r'^submit_policy', views.submit_policy, name='submit_policy'),
    url(r'^custom_tag', views.custom_tag, name='custom_tag'),
	url(r'^rank', views.rank, name='rank'),
    url(r'^save_rank', views.save_rank, name='save_rank'),
	url(r'^gen', views.gen, name='generator'),
	# url(r'^questions', views.survey, name='survey'),
	# url(r'^end', views.end, name='end'),
]
