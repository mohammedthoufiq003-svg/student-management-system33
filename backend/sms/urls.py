"""
Main URL file for the whole project.

/              -> Student Management UI (HTML page)
/admin/        -> Django Admin
/api/students/ -> REST API
"""

from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("students.urls")),
    path(
        "",
        TemplateView.as_view(template_name="index.html"),
        name="home",
    ),
]

admin.site.site_header = "Student Management Admin"
admin.site.site_title = "SMS Admin"
admin.site.index_title = "Manage Students"
