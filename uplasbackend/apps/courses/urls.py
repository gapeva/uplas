from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, ModuleViewSet, TopicViewSet,
    EnrollCourseView, UserEnrollmentListView
)

app_name = 'courses'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet) 
router.register(r'topics', TopicViewSet) # Register Topics explicitly to access /courses/topics/{id}/submit_answer/

urlpatterns = [
    path('', include(router.urls)),
    path('enrollments/', UserEnrollmentListView.as_view(), name='user-enrollments'),
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
]

