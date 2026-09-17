from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "student_id",
        "name",
        "email",
        "phone",
        "department",
        "year",
        "city",
        "created_at",
    )
    search_fields = ("student_id", "name", "email", "phone", "department", "city")
    list_filter = ("department", "year", "city")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
