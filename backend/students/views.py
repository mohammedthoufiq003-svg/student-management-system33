"""
API views for Student CRUD.

ModelViewSet automatically gives:
GET, POST, PUT, PATCH, DELETE
"""

from rest_framework import filters, viewsets
from rest_framework.exceptions import ValidationError

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    authentication_classes = []
    permission_classes = []
    filter_backends = [filters.SearchFilter]
    search_fields = ["student_id", "name", "email", "phone", "department", "city"]

    def handle_exception(self, exc):
        # Keep API errors in a simple JSON format for the frontend.
        response = super().handle_exception(exc)
        if isinstance(exc, ValidationError):
            return response
        return response
