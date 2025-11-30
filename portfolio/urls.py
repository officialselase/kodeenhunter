from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProjectViewSet, ContactViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
