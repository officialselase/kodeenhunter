from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.conf import settings
from datetime import datetime, timedelta, time
from .models import BookingService, Booking, BookingAvailability
from .serializers import (
    BookingServiceSerializer,
    BookingSerializer,
    BookingAvailabilitySerializer,
    AvailableSlotSerializer
)

# Cache timeout from settings
CACHE_TTL = getattr(settings, 'API_CACHE_TIMEOUT', 300)


class BookingServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BookingService.objects.filter(is_active=True)
    serializer_class = BookingServiceSerializer
    lookup_field = 'slug'
    
    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    lookup_field = 'booking_number'
    
    def get_queryset(self):
        queryset = Booking.objects.all()
        
        # Filter by customer email (for customer to view their bookings)
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(customer_email=email)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            # TODO: Send confirmation email here
            return Response(
                {
                    'message': 'Booking request submitted successfully! You will receive a confirmation email shortly.',
                    'booking': BookingSerializer(booking).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for a specific date"""
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service')
        
        if not date_str:
            return Response(
                {'error': 'Date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get service duration
        duration_hours = 2  # Default
        if service_id:
            try:
                service = BookingService.objects.get(id=service_id)
                duration_hours = float(service.duration_hours)
            except BookingService.DoesNotExist:
                pass
        
        # Get availability rules for this day
        weekday = target_date.weekday()
        availability_rules = BookingAvailability.objects.filter(
            is_available=True
        ).filter(
            models.Q(weekday=weekday) | models.Q(specific_date=target_date)
        )
        
        if not availability_rules.exists():
            # Default availability: 9 AM to 5 PM
            availability_rules = [
                type('obj', (object,), {
                    'start_time': time(9, 0),
                    'end_time': time(17, 0)
                })()
            ]
        
        # Generate time slots
        available_slots = []
        for rule in availability_rules:
            current_time = datetime.combine(target_date, rule.start_time)
            end_time = datetime.combine(target_date, rule.end_time)
            
            while current_time + timedelta(hours=duration_hours) <= end_time:
                slot_time = current_time.time()
                
                # Check if slot is already booked
                is_booked = Booking.objects.filter(
                    booking_date=target_date,
                    booking_time=slot_time,
                    status__in=['pending', 'confirmed']
                ).exists()
                
                available_slots.append({
                    'date': target_date,
                    'time': slot_time,
                    'available': not is_booked
                })
                
                current_time += timedelta(hours=1)  # 1-hour intervals
        
        serializer = AvailableSlotSerializer(available_slots, many=True)
        return Response(serializer.data)


from django.db import models  # Import for Q objects
