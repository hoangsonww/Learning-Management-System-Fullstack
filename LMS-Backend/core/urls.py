from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, CourseViewSet, CategoryViewSet, LessonViewSet, QuizViewSet,
                    QuestionViewSet, ChoiceViewSet, EnrollmentViewSet, ProgressViewSet, NotificationViewSet)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'choices', ChoiceViewSet, basename='choice')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
