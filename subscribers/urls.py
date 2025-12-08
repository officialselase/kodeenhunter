from django.urls import path
from .views import SubscribeView, unsubscribe_view, subscriber_status

app_name = 'subscribers'

urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe/', unsubscribe_view, name='unsubscribe'),
    path('status/', subscriber_status, name='status'),
]
