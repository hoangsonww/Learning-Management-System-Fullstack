from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from mongoengine import connect, disconnect
from .models import User, Category, Course, Lesson, Quiz, Question, Choice, Enrollment, Progress, Notification


class BaseAPITestCase(TestCase):
    """
    Base test case to handle setup and teardown for MongoDB.
    """

    def setUp(self):
        # Connect to test database
        connect('mongoenginetest', host='mongomock://localhost')

        self.client = APIClient()

    def tearDown(self):
        disconnect()


class UserModelTest(BaseAPITestCase):
    def test_create_user(self):
        user = User(username='testuser', email='test@example.com', is_instructor=True, bio='An experienced instructor')
        user.save()

        # Check if user is saved correctly
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.is_instructor)


class CourseModelTest(BaseAPITestCase):
    def test_create_course(self):
        instructor = User(username='instructor', email='instructor@example.com', is_instructor=True)
        instructor.save()

        category = Category(name='Programming', description='Learn programming languages')
        category.save()

        course = Course(title='Python Basics', description='Learn the basics of Python', instructor=instructor,
                        category=category)
        course.save()

        self.assertEqual(Course.objects.count(), 1)
        self.assertEqual(course.title, 'Python Basics')
        self.assertEqual(course.instructor.username, 'instructor')


class UserViewSetTest(BaseAPITestCase):
    def test_user_list(self):
        User(username='user1', email='user1@example.com').save()
        User(username='user2', email='user2@example.com').save()

        response = self.client.get('/users/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_create(self):
        user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "is_instructor": True,
            "bio": "An experienced instructor"
        }
        response = self.client.post('/users/', user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().username, 'testuser')


class CourseViewSetTest(BaseAPITestCase):
    def test_course_list(self):
        instructor = User(username='instructor', email='instructor@example.com', is_instructor=True)
        instructor.save()

        category = Category(name='Programming', description='Learn programming languages')
        category.save()

        Course(title='Python Basics', description='Learn Python', instructor=instructor, category=category).save()
        Course(title='Django Basics', description='Learn Django', instructor=instructor, category=category).save()

        response = self.client.get('/courses/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_course_create(self):
        instructor = User(username='instructor', email='instructor@example.com', is_instructor=True)
        instructor.save()

        category = Category(name='Programming', description='Learn programming languages')
        category.save()

        course_data = {
            "title": "JavaScript Basics",
            "description": "Learn JavaScript",
            "instructor": str(instructor.id),
            "category": str(category.id),
            "price": 19.99
        }
        response = self.client.post('/courses/', course_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 1)
        self.assertEqual(Course.objects.first().title, 'JavaScript Basics')


class LessonViewSetTest(BaseAPITestCase):
    def test_lesson_create(self):
        instructor = User(username='instructor', email='instructor@example.com', is_instructor=True)
        instructor.save()

        category = Category(name='Programming', description='Learn programming languages')
        category.save()

        course = Course(title='Python Basics', description='Learn Python', instructor=instructor, category=category)
        course.save()

        lesson_data = {
            "title": "Introduction to Python",
            "course": str(course.id),
            "content": "This is an introduction to Python programming."
        }
        response = self.client.post('/lessons/', lesson_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lesson.objects.count(), 1)
        self.assertEqual(Lesson.objects.first().title, 'Introduction to Python')


class QuizViewSetTest(BaseAPITestCase):
    def test_quiz_create(self):
        instructor = User(username='instructor', email='instructor@example.com', is_instructor=True)
        instructor.save()

        category = Category(name='Programming', description='Learn programming languages')
        category.save()

        course = Course(title='Python Basics', description='Learn Python', instructor=instructor, category=category)
        course.save()

        lesson = Lesson(title='Introduction to Python', course=course, content='Introduction content')
        lesson.save()

        quiz_data = {
            "title": "Python Basics Quiz",
            "lesson": str(lesson.id)
        }
        response = self.client.post('/quizzes/', quiz_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Quiz.objects.count(), 1)
        self.assertEqual(Quiz.objects.first().title, 'Python Basics Quiz')
