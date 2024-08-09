# -*- coding: utf-8 -*-
from django.urls import path
from application.websocketConfig import MegCenter
from mansible.playbookconsumers import ansible_playbook_ResConsumer
from mansible.adhoconsumes import AnsibleAdhocConsumer

websocket_urlpatterns = [
    # consumers.DvadminWebSocket 是该路由的消费者
    path('ws/<str:service_uid>/', MegCenter.as_asgi()),  
    path('ansible_playbook/', ansible_playbook_ResConsumer.as_asgi()),
    path('ansible_adhoc/', AnsibleAdhocConsumer.as_asgi()),
]
