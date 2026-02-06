# apps/ai_agents/models.py
import uuid
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class AIAgent(BaseModel):
    """User-specific AI agent configurations/personas."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_agents')
    name = models.CharField(max_length=255)
    persona = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'ai_agents'

    def __str__(self):
        return self.name


class AIInteraction(BaseModel):
    """Logs AI agent interactions for analytics and debugging."""
    INTERACTION_TYPES = [
        ('nlp_tutor', 'NLP Tutor'),
        ('project_idea', 'Project Idea Generator'),
        ('project_assessment', 'Project Assessment'),
        ('tts', 'Text-to-Speech'),
        ('ttv', 'Text-to-Video'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='ai_interactions'
    )
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    request_payload = models.JSONField(default=dict)
    response_payload = models.JSONField(default=dict)
    processing_time_ms = models.IntegerField(null=True, blank=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        app_label = 'ai_agents'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.interaction_type} - {self.created_at}"
