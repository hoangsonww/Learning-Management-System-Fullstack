from mongoengine import Document, fields


class User(Document):
    username = fields.StringField(required=True, max_length=100, unique=True)
    email = fields.EmailField(required=True, unique=True)
    is_instructor = fields.BooleanField(default=False)
    is_student = fields.BooleanField(default=True)
    bio = fields.StringField()
    profile_picture = fields.StringField()

    meta = {'collection': 'users'}


class Category(Document):
    name = fields.StringField(max_length=100)
    description = fields.StringField()

    meta = {'collection': 'categories'}


class Course(Document):
    title = fields.StringField(max_length=255)
    description = fields.StringField()
    instructor = fields.ReferenceField(User, reverse_delete_rule='CASCADE')
    category = fields.ReferenceField(Category, reverse_delete_rule='NULLIFY')
    created_at = fields.DateTimeField()
    updated_at = fields.DateTimeField()
    image = fields.StringField()
    price = fields.DecimalField(min_value=0)
    published = fields.BooleanField(default=False)

    meta = {'collection': 'courses'}


class Lesson(Document):
    title = fields.StringField(max_length=255)
    course = fields.ReferenceField(Course, reverse_delete_rule='CASCADE')
    content = fields.StringField()
    video_url = fields.StringField()
    created_at = fields.DateTimeField()
    updated_at = fields.DateTimeField()

    meta = {'collection': 'lessons'}


class Quiz(Document):
    lesson = fields.ReferenceField(Lesson, reverse_delete_rule='CASCADE')
    title = fields.StringField(max_length=255)
    created_at = fields.DateTimeField()

    meta = {'collection': 'quizzes'}


class Question(Document):
    quiz = fields.ReferenceField(Quiz, reverse_delete_rule='CASCADE')
    text = fields.StringField(max_length=1024)
    answer = fields.StringField(max_length=1024)
    created_at = fields.DateTimeField()

    meta = {'collection': 'questions'}


class Choice(Document):
    question = fields.ReferenceField(Question, reverse_delete_rule='CASCADE')
    text = fields.StringField(max_length=255)
    is_correct = fields.BooleanField(default=False)

    meta = {'collection': 'choices'}


class Enrollment(Document):
    student = fields.ReferenceField(User, reverse_delete_rule='CASCADE')
    course = fields.ReferenceField(Course, reverse_delete_rule='CASCADE')
    enrolled_at = fields.DateTimeField()

    meta = {'collection': 'enrollments'}


class Progress(Document):
    student = fields.ReferenceField(User, reverse_delete_rule='CASCADE')
    lesson = fields.ReferenceField(Lesson, reverse_delete_rule='CASCADE')
    completed = fields.BooleanField(default=False)
    completed_at = fields.DateTimeField()

    meta = {'collection': 'progress'}


class Notification(Document):
    recipient = fields.ReferenceField(User, reverse_delete_rule='CASCADE')
    message = fields.StringField(max_length=255)
    created_at = fields.DateTimeField()
    is_read = fields.BooleanField(default=False)

    meta = {'collection': 'notifications'}
