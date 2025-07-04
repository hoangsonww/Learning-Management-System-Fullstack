"""
Integration-style “green-path” checks for the MongoEngine models.

▪︎  Uses an in-memory MongoDB via *mongomock* – no external service needed.
▪︎  If either *mongoengine* or *mongomock* is missing we skip (exit-code 0).
▪︎  Otherwise we create a small realistic graph of documents and make sure
    relations & defaults behave as expected.
"""
from __future__ import annotations

import datetime as _dt
import pytest

import warnings
warnings.filterwarnings(
    "ignore",
    message="No uuidRepresentation is specified!",
    category=DeprecationWarning,
)

# --------------------------------------------------------------------------- #
# 1 ·  Import mongoengine + mongomock – otherwise skip the entire file.
# --------------------------------------------------------------------------- #
mongoengine = pytest.importorskip(
    "mongoengine", reason="mongoengine not installed"
)
mongomock = pytest.importorskip(
    "mongomock", reason="mongomock not installed (needed for in-memory DB)"
)

from mongoengine import connect, disconnect_all  # type: ignore

# --------------------------------------------------------------------------- #
# 2 ·  Connect to an in-memory “DB” just for this test-session.
# --------------------------------------------------------------------------- #
connect(
    "lms_test",  # arbitrary DB name
    host="mongodb://localhost",
    mongo_client_class=mongomock.MongoClient,
)

# --------------------------------------------------------------------------- #
# 3 ·  Import project’s models – these are the ones we test.
# --------------------------------------------------------------------------- #
from core.models import (  # noqa: E402  pylint: disable=C0413
    User,
    Category,
    Course,
    Lesson,
    Quiz,
    Question,
    Choice,
    Enrollment,
    Progress,
)

# --------------------------------------------------------------------------- #
# 4 ·  Data-factory helpers – keep the tests tidy.
# --------------------------------------------------------------------------- #
def _user(name="alice", **kw):
    return User(username=name, email=f"{name}@example.com", **kw).save()


def _category(name="General"):
    return Category(name=name).save()


def _course(title="Intro", instructor=None, category=None, **kw):
    return Course(
        title=title,
        instructor=instructor or _user(),
        category=category or _category(),
        created_at=_dt.datetime.utcnow(),
        updated_at=_dt.datetime.utcnow(),
        **kw,
    ).save()


# --------------------------------------------------------------------------- #
# 5 ·  Actual tests
# --------------------------------------------------------------------------- #
def test_course_creation_and_relations():
    inst = _user("inst")
    cat = _category("Science")
    course = _course("Physics 101", instructor=inst, category=cat)

    # The fields are stored & referenced correctly
    assert course.title == "Physics 101"
    assert course.instructor.username == "inst"
    assert course.category.name == "Science"
    assert course.published is False  # default value


def test_lesson_quiz_question_choice_chain():
    course = _course()
    lesson = Lesson(title="Kinematics", course=course).save()
    quiz = Quiz(title="Quiz 1", lesson=lesson).save()
    question = Question(quiz=quiz, text="2+2=?", answer="4").save()
    choice1 = Choice(question=question, text="4", is_correct=True).save()
    choice2 = Choice(question=question, text="5").save()

    # Follow the chain back & forth
    assert question.quiz == quiz
    assert choice1.question == question
    assert choice2.is_correct is False
    assert len(Choice.objects(question=question)) == 2


def test_enrollment_and_progress_flow():
    student = _user("bob", is_student=True)
    course = _course()
    lesson = Lesson(title="Vectors", course=course).save()

    enrollment = Enrollment(student=student, course=course).save()
    progress = Progress(student=student, lesson=lesson, completed=True).save()

    # Baseline sanity
    assert enrollment.student == student
    assert progress.completed is True
    # quick aggregation
    assert Enrollment.objects.count() == 1
    assert Progress.objects(completed=True).count() == 1


# --------------------------------------------------------------------------- #
# 6 ·  Clean-up – drop all collections & disconnect.
# --------------------------------------------------------------------------- #
def teardown_module(_mod):
    for cls in (
        User,
        Category,
        Course,
        Lesson,
        Quiz,
        Question,
        Choice,
        Enrollment,
        Progress,
    ):
        cls.drop_collection()
    disconnect_all()
