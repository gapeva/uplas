from django.urls import path, include
from .views import api_root, health_check

app_name = 'core'

urlpatterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='health-check'),
]

