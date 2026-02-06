# courses/urls.py
from django.urls import path
from .views import (
    CourseListView, 
    CourseDetailView, 
    LessonContentView, 
    TeamMemberListView,
    EnrollCourseView
)

app_name = 'courses'

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    
    # Added Enrollment Endpoint
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),

    path('lessons/<int:pk>/content/', LessonContentView.as_view(), name='lesson-content'),
    path('team/', TeamMemberListView.as_view(), name='team-list'),
]
