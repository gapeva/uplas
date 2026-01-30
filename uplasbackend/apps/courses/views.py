from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Course, Module, Topic
from .serializers import CategorySerializer, CourseListSerializer, CourseDetailSerializer, ModuleDetailSerializer, TopicDetailSerializer
from apps.payments.models import UserSubscription # CORRECTED IMPORT
from .permissions import IsInstructorOrReadOnly, IsEnrolled

# ==============================================================================
# EXISTING VIEWSETS (Kept these as they are good for Router-based URLs)
# ==============================================================================

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_published=True)
    permission_classes = [IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category__slug', 'level']
    search_fields = ['title', 'short_description', 'long_description']
    ordering_fields = ['title', 'price', 'created_at', 'average_rating']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleDetailSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        course_slug = self.kwargs.get('course_slug')
        return Module.objects.filter(course__slug=course_slug).order_by('order')

    def perform_create(self, serializer):
        course = Course.objects.get(slug=self.kwargs.get('course_slug'))
        serializer.save(course=course)

class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicDetailSerializer
    permission_classes = [IsEnrolled] # Users must be enrolled to view topics
    lookup_field = 'slug'

    def get_queryset(self):
        module_id = self.kwargs.get('module_pk')
        return Topic.objects.filter(module_id=module_id).order_by('order')

    def perform_create(self, serializer):
        module = Module.objects.get(pk=self.kwargs.get('module_pk'))
        serializer.save(module=module)


# ==============================================================================
# SPECIFIC VIEWS (Added these to fix your ImportError)
# ==============================================================================

# 1. Course List View (Inherits filtering from GenericAPIView)
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category__slug', 'level']
    search_fields = ['title', 'short_description', 'long_description']
    ordering_fields = ['title', 'price', 'created_at', 'average_rating']

# 2. Course Detail View
class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# 3. Lesson Content View (Placeholder implementation to safely start server)
class LessonContentView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Basic safety
    
    def get(self, request, course_slug=None, module_slug=None, lesson_slug=None):
        return Response(
            {"message": "Lesson content logic placeholder. Replace with actual retrieval logic."},
            status=status.HTTP_200_OK
        )

# 4. Team Member List View (Placeholder implementation)
class TeamMemberListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            [{"name": "Instructor 1", "role": "Lead"}, {"name": "Instructor 2", "role": "Assistant"}],
            status=status.HTTP_200_OK
        )