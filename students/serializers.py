"""
Serializer converts Student model data to JSON and back.

The frontend and REST API both use this JSON format.
"""

from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "name",
            "email",
            "phone",
            "department",
            "year",
            "city",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_student_id(self, value):
        cleaned = value.strip().upper()
        if " " in cleaned:
            raise serializers.ValidationError("Student ID should not contain spaces.")
        return cleaned

    def validate_name(self, value):
        cleaned = " ".join(value.strip().split())
        if len(cleaned) < 3:
            raise serializers.ValidationError("Name must have at least 3 characters.")
        if not all(part.isalpha() for part in cleaned.split()):
            raise serializers.ValidationError("Name should contain letters only.")
        return cleaned.title()

    def validate_city(self, value):
        cleaned = " ".join(value.strip().split())
        if len(cleaned) < 2:
            raise serializers.ValidationError("City name is too short.")
        return cleaned.title()

    def validate_email(self, value):
        return value.strip().lower()
