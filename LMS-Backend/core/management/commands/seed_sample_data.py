from django.core.management.base import BaseCommand
from core.models import User, Course, Category, Lesson, Quiz, Question, Choice, Enrollment, Progress, Notification
from datetime import datetime
from faker import Faker
import random


class Command(BaseCommand):
    help = 'Seed realistic sample data for all API endpoints'

    def handle(self, *args, **kwargs):
        # Initialize Faker
        fake = Faker()

        # Clear existing data
        User.drop_collection()
        Category.drop_collection()
        Course.drop_collection()
        Lesson.drop_collection()
        Quiz.drop_collection()
        Question.drop_collection()
        Choice.drop_collection()
        Enrollment.drop_collection()
        Progress.drop_collection()
        Notification.drop_collection()

        # Seed Users
        users = [
            User(
                username=fake.user_name(),
                email=fake.email(),
                is_instructor=random.choice([True, False]),
                is_student=random.choice([True, False]),
                bio=fake.paragraph(nb_sentences=2),
                profile_picture=fake.image_url()
            ).save()
            for _ in range(10)
        ]

        # Seed Categories
        categories = [
            Category(
                name=fake.word().capitalize(),
                description=fake.sentence(nb_words=6)
            ).save()
            for _ in range(5)
        ]

        # Seed Courses
        courses = [
            Course(
                title=fake.catch_phrase(),
                description=fake.paragraph(nb_sentences=5),
                instructor=random.choice(users),
                category=random.choice(categories),
                created_at=datetime.now(),
                updated_at=datetime.now(),
                image=fake.image_url(),
                price=random.uniform(50, 500),
                published=random.choice([True, False])
            ).save()
            for _ in range(8)
        ]

        # Seed Lessons
        lessons = [
            Lesson(
                title=fake.sentence(nb_words=4),
                course=random.choice(courses),
                content=fake.text(max_nb_chars=200),
                video_url=fake.url(),
                created_at=datetime.now(),
                updated_at=datetime.now()
            ).save()
            for _ in range(15)
        ]

        # Seed Quizzes
        quizzes = [
            Quiz(
                lesson=random.choice(lessons),
                title=fake.sentence(nb_words=3),
                created_at=datetime.now()
            ).save()
            for _ in range(10)
        ]

        # Seed Questions
        questions = [
            Question(
                quiz=random.choice(quizzes),
                text=fake.sentence(nb_words=10) + "?",
                answer=fake.word(),
                created_at=datetime.now()
            ).save()
            for _ in range(20)
        ]

        # Seed Choices
        choices = [
            Choice(
                question=random.choice(questions),
                text=fake.sentence(nb_words=4),
                is_correct=random.choice([True, False])
            ).save()
            for _ in range(40)
        ]

        # Seed Enrollments
        enrollments = [
            Enrollment(
                student=random.choice(users),
                course=random.choice(courses),
                enrolled_at=datetime.now()
            ).save()
            for _ in range(10)
        ]

        # Seed Progress
        progress_records = [
            Progress(
                student=random.choice(users),
                lesson=random.choice(lessons),
                completed=random.choice([True, False]),
                completed_at=datetime.now() if random.choice([True, False]) else None
            ).save()
            for _ in range(10)
        ]

        # Seed Notifications
        notifications = [
            Notification(
                recipient=random.choice(users),
                message=fake.sentence(nb_words=6),
                created_at=datetime.now(),
                is_read=random.choice([True, False])
            ).save()
            for _ in range(10)
        ]

        self.stdout.write(self.style.SUCCESS('Successfully seeded realistic sample data'))
