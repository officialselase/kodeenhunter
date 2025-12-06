from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProjectViewSet, ContactSubmissionView, ServiceViewSet, TestimonialViewSet, AwardViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'awards', AwardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactSubmissionView.as_view(), name='contact-submission'),
]
