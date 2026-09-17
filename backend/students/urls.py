"""
API routes for students.

GET    /api/students/
POST   /api/students/
GET    /api/students/<id>/
PUT    /api/students/<id>/
PATCH  /api/students/<id>/
DELETE /api/students/<id>/
"""

from rest_framework.routers import DefaultRouter

from .views import StudentViewSet

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")

urlpatterns = router.urls
