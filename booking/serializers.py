from rest_framework import serializers
from .models import BookingService, Booking, BookingAvailability
from django.utils import timezone
from datetime import datetime, timedelta


class BookingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingService
        fields = ['id', 'name', 'slug', 'description', 'duration_hours', 'price']


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_number', 'service', 'service_name',
            'customer_name', 'customer_email', 'customer_phone',
            'booking_date', 'booking_time', 'duration_hours', 'location',
            'message', 'status', 'price', 'created_at'
        ]
        read_only_fields = ['booking_number', 'status', 'created_at']
    
    def validate_booking_date(self, value):
        """Ensure booking date is in the future"""
        if value < timezone.now().date():
            raise serializers.ValidationError("Booking date must be in the future.")
        return value
    
    def validate(self, data):
        """Validate booking doesn't conflict with existing bookings"""
        booking_date = data.get('booking_date')
        booking_time = data.get('booking_time')
        duration = data.get('duration_hours', 1)
        
        if booking_date and booking_time:
            # Check for conflicting bookings
            booking_datetime = timezone.make_aware(
                datetime.combine(booking_date, booking_time)
            )
            end_datetime = booking_datetime + timedelta(hours=float(duration))
            
            # Find overlapping bookings
            overlapping = Booking.objects.filter(
                booking_date=booking_date,
                status__in=['pending', 'confirmed']
            ).exclude(id=self.instance.id if self.instance else None)
            
            for booking in overlapping:
                existing_start = timezone.make_aware(
                    datetime.combine(booking.booking_date, booking.booking_time)
                )
                existing_end = existing_start + timedelta(hours=float(booking.duration_hours))
                
                # Check for overlap
                if (booking_datetime < existing_end and end_datetime > existing_start):
                    raise serializers.ValidationError(
                        "This time slot is already booked. Please choose a different time."
                    )
        
        return data
    
    def create(self, validated_data):
        # Set price from service if not provided
        if 'price' not in validated_data and validated_data.get('service'):
            validated_data['price'] = validated_data['service'].price
        
        # Set duration from service if not provided
        if 'duration_hours' not in validated_data and validated_data.get('service'):
            validated_data['duration_hours'] = validated_data['service'].duration_hours
        
        return super().create(validated_data)


class BookingAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingAvailability
        fields = ['id', 'weekday', 'specific_date', 'start_time', 'end_time', 'is_available', 'notes']


class AvailableSlotSerializer(serializers.Serializer):
    """Serializer for available time slots"""
    date = serializers.DateField()
    time = serializers.TimeField()
    available = serializers.BooleanField()
