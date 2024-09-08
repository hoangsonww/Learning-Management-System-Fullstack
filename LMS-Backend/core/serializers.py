from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import User, Category, Course, Lesson, Quiz, Question, Choice, Enrollment, Progress, Notification


class UserSerializer(DocumentSerializer):
    class Meta:
        model = User
        fields = '__all__'


class CategorySerializer(DocumentSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(DocumentSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class LessonSerializer(DocumentSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class QuizSerializer(DocumentSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class QuestionSerializer(DocumentSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class ChoiceSerializer(DocumentSerializer):
    class Meta:
        model = Choice
        fields = '__all__'


class EnrollmentSerializer(DocumentSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'


class ProgressSerializer(DocumentSerializer):
    class Meta:
        model = Progress
        fields = '__all__'


class NotificationSerializer(DocumentSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
