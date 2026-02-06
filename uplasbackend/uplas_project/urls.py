# uplas_project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'Uplas Backend API',
        'version': '1.0.0'
    })

urlpatterns = [
    path('', health_check, name='health_check'),
    path('health/', health_check, name='health'),
    path('admin/', admin.site.urls),
    
    # API URLS
    path('api/v1/auth/', include('apps.users.urls', namespace='users')),
    path('api/v1/payments/', include('apps.payments.urls', namespace='payments')),
    path('api/v1/courses/', include('apps.courses.urls', namespace='courses')),
    path('api/v1/projects/', include('apps.projects.urls', namespace='projects')),
    path('api/v1/community/', include('apps.community.urls', namespace='community')),
    path('api/v1/blog/', include('apps.blog.urls', namespace='blog')),
    path('api/v1/ai/', include('apps.ai_agents.urls', namespace='ai_agents')),

    # Core API Root
    path('api/v1/', include('apps.core.urls', namespace='core')),
]