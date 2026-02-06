# apps/ai_agents/views.py
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import AIAgent, AIInteraction
from .serializers import (
    AIAgentSerializer,
    AIInteractionSerializer,
    NLPTutorRequestSerializer,
    ProjectIdeaRequestSerializer,
    ProjectAssessmentRequestSerializer,
    TTSRequestSerializer,
    TTVRequestSerializer,
)
from .services import ai_agent_service

logger = logging.getLogger(__name__)


class AIAgentViewSet(viewsets.ModelViewSet):
    """API endpoint for managing user AI agent configurations."""
    serializer_class = AIAgentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIAgent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AIInteractionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing AI interaction history."""
    serializer_class = AIInteractionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIInteraction.objects.filter(user=self.request.user)


def get_user_profile_snapshot(user, provided_snapshot=None):
    """Build user profile snapshot from user data or provided snapshot."""
    if provided_snapshot:
        return provided_snapshot
    
    return {
        "industry": getattr(user, 'industry', 'Technology'),
        "profession": getattr(user, 'profession', 'Professional'),
        "preferred_tutor_persona": getattr(user, 'preferred_tutor_persona', 'Friendly'),
        "areas_of_interest": getattr(user, 'areas_of_interest', []),
    }


def log_interaction(user, interaction_type, request_payload, response_data):
    """Log an AI interaction to the database."""
    try:
        success = response_data.get('status') == 'success'
        processing_time = response_data.get('metadata', {}).get('processing_time_ms')
        error_msg = response_data.get('error') if not success else None
        
        AIInteraction.objects.create(
            user=user,
            interaction_type=interaction_type,
            request_payload=request_payload,
            response_payload=response_data,
            processing_time_ms=processing_time,
            success=success,
            error_message=error_msg,
        )
    except Exception as e:
        logger.error(f"Failed to log AI interaction: {e}")


class NLPTutorView(APIView):
    """Process text with the personalized NLP tutor."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NLPTutorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user_profile = get_user_profile_snapshot(
            request.user, 
            data.get('user_profile_snapshot')
        )
        
        try:
            result = ai_agent_service.process_nlp_tutor_request(
                query_text=data['query_text'],
                user_profile=user_profile,
                context=data.get('context', {})
            )
            
            log_interaction(request.user, 'nlp_tutor', data, result)
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"NLP Tutor error: {e}", exc_info=True)
            return Response(
                {"status": "error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProjectIdeaGeneratorView(APIView):
    """Generate personalized project ideas."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProjectIdeaRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user_profile = get_user_profile_snapshot(
            request.user,
            data.get('user_profile_snapshot')
        )
        
        try:
            result = ai_agent_service.generate_project_idea(
                course_context=data['course_context'],
                user_profile=user_profile
            )
            
            log_interaction(request.user, 'project_idea', data, result)
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Project Generator error: {e}", exc_info=True)
            return Response(
                {"status": "error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProjectAssessmentView(APIView):
    """Assess project submissions."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProjectAssessmentRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user_profile = get_user_profile_snapshot(
            request.user,
            data.get('user_profile_snapshot')
        )
        
        try:
            result = ai_agent_service.assess_project_submission(
                submission_data=data['submission_artifacts'],
                user_profile=user_profile
            )
            
            log_interaction(request.user, 'project_assessment', data, result)
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Project Assessment error: {e}", exc_info=True)
            return Response(
                {"status": "error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TextToSpeechView(APIView):
    """Convert text to speech."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TTSRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            result = ai_agent_service.text_to_speech(
                text=data['text'],
                voice_settings=data.get('voice_settings', {})
            )
            
            log_interaction(request.user, 'tts', data, result)
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"TTS error: {e}", exc_info=True)
            return Response(
                {"status": "error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TextToVideoView(APIView):
    """Convert text to video."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TTVRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            result = ai_agent_service.text_to_video(
                text=data['text'],
                video_settings=data.get('video_settings', {})
            )
            
            log_interaction(request.user, 'ttv', data, result)
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"TTV error: {e}", exc_info=True)
            return Response(
                {"status": "error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AIHealthCheckView(APIView):
    """Health check endpoint for AI services."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "Uplas AI Agent Service",
            "version": ai_agent_service.version,
            "endpoints": {
                "nlp_tutor": "/api/v1/ai/nlp-tutor/",
                "project_generator": "/api/v1/ai/project-generator/",
                "project_assessment": "/api/v1/ai/project-assessment/",
                "tts": "/api/v1/ai/tts/",
                "ttv": "/api/v1/ai/ttv/",
            }
        })
