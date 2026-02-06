# apps/ai_agents/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AIAgentViewSet,
    AIInteractionViewSet,
    NLPTutorView,
    ProjectIdeaGeneratorView,
    ProjectAssessmentView,
    TextToSpeechView,
    TextToVideoView,
    AIHealthCheckView,
)

router = DefaultRouter()
router.register(r'agents', AIAgentViewSet, basename='agent')
router.register(r'interactions', AIInteractionViewSet, basename='interaction')

app_name = 'ai_agents'

urlpatterns = [
    # Health check
    path('health/', AIHealthCheckView.as_view(), name='ai-health'),
    
    # AI Service Endpoints
    path('nlp-tutor/', NLPTutorView.as_view(), name='nlp-tutor'),
    path('project-generator/', ProjectIdeaGeneratorView.as_view(), name='project-generator'),
    path('project-assessment/', ProjectAssessmentView.as_view(), name='project-assessment'),
    path('tts/', TextToSpeechView.as_view(), name='tts'),
    path('ttv/', TextToVideoView.as_view(), name='ttv'),
    
    # CRUD endpoints for agents and interactions
    path('', include(router.urls)),
]
