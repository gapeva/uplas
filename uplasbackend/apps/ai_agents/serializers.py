# apps/ai_agents/serializers.py
from rest_framework import serializers
from .models import AIAgent, AIInteraction


class AIAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAgent
        fields = ['id', 'name', 'persona', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AIInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteraction
        fields = [
            'id', 'interaction_type', 'request_payload', 'response_payload',
            'processing_time_ms', 'success', 'error_message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# Request Serializers for AI Endpoints
class UserProfileSnapshotSerializer(serializers.Serializer):
    """User profile snapshot for AI personalization."""
    industry = serializers.CharField(max_length=100)
    profession = serializers.CharField(max_length=100)
    preferred_tutor_persona = serializers.CharField(max_length=50, default="Friendly")
    areas_of_interest = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )


class NLPTutorRequestSerializer(serializers.Serializer):
    """Request serializer for NLP Tutor endpoint."""
    query_text = serializers.CharField(max_length=5000)
    user_profile_snapshot = UserProfileSnapshotSerializer(required=False)
    context = serializers.DictField(required=False, default=dict)


class ProjectIdeaRequestSerializer(serializers.Serializer):
    """Request serializer for Project Idea Generator."""
    course_context = serializers.DictField()
    user_profile_snapshot = UserProfileSnapshotSerializer(required=False)


class ProjectAssessmentRequestSerializer(serializers.Serializer):
    """Request serializer for Project Assessment."""
    submission_artifacts = serializers.DictField()
    user_profile_snapshot = UserProfileSnapshotSerializer(required=False)


class TTSRequestSerializer(serializers.Serializer):
    """Request serializer for Text-to-Speech."""
    text = serializers.CharField(max_length=10000)
    voice_settings = serializers.DictField(required=False, default=dict)


class TTVRequestSerializer(serializers.Serializer):
    """Request serializer for Text-to-Video."""
    text = serializers.CharField(max_length=10000)
    video_settings = serializers.DictField(required=False, default=dict)
