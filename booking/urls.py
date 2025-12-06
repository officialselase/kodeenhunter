from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingServiceViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'services', BookingServiceViewSet, basename='booking-service')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
