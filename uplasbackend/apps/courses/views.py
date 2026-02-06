from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Course, Module, Topic
from .serializers import CategorySerializer, CourseListSerializer, CourseDetailSerializer, ModuleDetailSerializer, TopicDetailSerializer
from .permissions import IsInstructorOrReadOnly, IsEnrolled

# ==============================================================================
# EXISTING VIEWSETS
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

    # --- ADD THIS ACTION ---
    @action(detail=True, methods=['get'], permission_classes=[IsEnrolled])
    def navigation(self, request, slug=None):
        """
        Returns the full course hierarchy (Modules -> Topics) with 
        completion status for the sidebar navigation.
        """
        course = self.get_object()
        modules = course.modules.all().order_by('order')
        
        # Build the tree manually or use a specific NavigationSerializer
        nav_data = {
            "title": course.title,
            "progress": 0, # Calculate actual progress here based on UserCourseProgress
            "modules": []
        }
        
        for module in modules:
            topics_data = []
            for topic in module.topics.all().order_by('order'):
                # Check if user has completed this topic
                # is_completed = topic.completions.filter(user=request.user).exists()
                is_completed = False # Placeholder logic
                topics_data.append({
                    "id": topic.id, # Using ID for mapping
                    "slug": topic.slug, # Useful if routing by slug
                    "title": topic.title,
                    "is_completed": is_completed,
                    "is_locked": False # Implement lock logic based on progress
                })
            
            nav_data["modules"].append({
                "id": module.id,
                "title": module.title,
                "topics": topics_data
            })
            
        return Response(nav_data)

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
    queryset = Topic.objects.all() # Added queryset
    serializer_class = TopicDetailSerializer
    permission_classes = [IsEnrolled]
    # lookup_field = 'slug' # Careful with lookup fields if using ID in routes

    def get_queryset(self):
        # If accessed nested
        if 'module_pk' in self.kwargs:
            return Topic.objects.filter(module_id=self.kwargs['module_pk']).order_by('order')
        return Topic.objects.all()

    def perform_create(self, serializer):
        module = Module.objects.get(pk=self.kwargs.get('module_pk'))
        serializer.save(module=module)

    # --- ADD THIS ACTION ---
    @action(detail=True, methods=['post'], url_path='submit_answer')
    def submit_answer(self, request, pk=None):
        """
        Validates a user's answer to a question within this topic.
        """
        topic = self.get_object()
        user_answer = request.data.get('answer')
        
        # Simple Logic: In reality, you'd look up the specific Question model
        # linked to this topic.
        # For parity, we assume the Topic has a "questions" relation or field.
        
        # Mocking the grading logic if Question model isn't strictly defined yet
        is_correct = True # Replace with: topic.questions.first().check_answer(user_answer)
        
        feedback = "Correct! You nailed the definition." if is_correct else "Not quite. Try focusing on..."
        
        return Response({
            "is_correct": is_correct,
            "feedback": feedback,
            "xp_awarded": 10 if is_correct else 0
        })


# ==============================================================================
# SPECIFIC VIEWS
# ==============================================================================

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category__slug', 'level']
    search_fields = ['title', 'short_description', 'long_description']
    ordering_fields = ['title', 'price', 'created_at', 'average_rating']

class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class EnrollCourseView(APIView):
    """
    Handles course enrollment. 
    POST /courses/<int:pk>/enroll/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        user = request.user

        if course.students.filter(id=user.id).exists():
            return Response({"message": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)

        course.students.add(user)
        
        return Response({
            "message": "Enrolled successfully",
            "course_slug": course.slug
        }, status=status.HTTP_201_CREATED)

class UserEnrollmentListView(generics.ListAPIView):
    """
    Lists courses the authenticated user is enrolled in.
    GET /courses/enrollments/
    """
    serializer_class = CourseListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(students=self.request.user)

class LessonContentView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request, course_slug=None, module_slug=None, lesson_slug=None):
        return Response(
            {"message": "Lesson content logic placeholder."},
            status=status.HTTP_200_OK
        )

class TeamMemberListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            [{"name": "Instructor 1", "role": "Lead"}, {"name": "Instructor 2", "role": "Assistant"}],
            status=status.HTTP_200_OK
        )
