"""
Student model = one table in SQLite.

Each class field becomes a database column.
"""

from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models


class Student(models.Model):
    YEAR_CHOICES = [
        ("1", "1st Year"),
        ("2", "2nd Year"),
        ("3", "3rd Year"),
        ("4", "4th Year"),
    ]

    DEPARTMENT_CHOICES = [
        ("CSE", "Computer Science and Engineering"),
        ("IT", "Information Technology"),
        ("ECE", "Electronics and Communication Engineering"),
        ("EEE", "Electrical and Electronics Engineering"),
        ("MECH", "Mechanical Engineering"),
        ("CIVIL", "Civil Engineering"),
        ("AIDS", "Artificial Intelligence and Data Science"),
        ("AIML", "Artificial Intelligence and Machine Learning"),
    ]

    phone_validator = RegexValidator(
        regex=r"^[6-9]\d{9}$",
        message="Enter a valid 10-digit Indian mobile number.",
    )

    student_id = models.CharField(
        max_length=20,
        unique=True,
        validators=[MinLengthValidator(3)],
        help_text="Unique college register number, for example STU001",
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10, validators=[phone_validator])
    department = models.CharField(max_length=10, choices=DEPARTMENT_CHOICES)
    year = models.CharField(max_length=1, choices=YEAR_CHOICES)
    city = models.CharField(max_length=80)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Student"
        verbose_name_plural = "Students"

    def __str__(self):
        return f"{self.student_id} - {self.name}"
