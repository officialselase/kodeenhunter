from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid


class BookingService(models.Model):
    """Services available for booking"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1, help_text="Duration in hours (e.g., 2.5)")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Base price for this service")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Booking(models.Model):
    """Customer booking requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    booking_number = models.CharField(max_length=50, unique=True, editable=False)
    service = models.ForeignKey(BookingService, on_delete=models.SET_NULL, null=True, related_name='bookings')
    
    # Customer information
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50)
    
    # Booking details
    booking_date = models.DateField()
    booking_time = models.TimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1)
    location = models.CharField(max_length=500, blank=True, help_text="Shoot location or meeting place")
    
    # Additional information
    message = models.TextField(blank=True, help_text="Additional details or requirements")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_paid = models.BooleanField(default=False)
    
    # Admin notes
    admin_notes = models.TextField(blank=True, help_text="Internal notes (not visible to customer)")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-booking_date', '-booking_time']
        indexes = [
            models.Index(fields=['booking_date', 'booking_time']),
            models.Index(fields=['status']),
            models.Index(fields=['customer_email']),
        ]
    
    def __str__(self):
        return f"{self.booking_number} - {self.customer_name} ({self.booking_date})"
    
    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = self.generate_booking_number()
        super().save(*args, **kwargs)
    
    def generate_booking_number(self):
        """Generate unique booking number"""
        return f"BK{timezone.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
    
    def is_upcoming(self):
        """Check if booking is in the future"""
        booking_datetime = timezone.make_aware(
            timezone.datetime.combine(self.booking_date, self.booking_time)
        )
        return booking_datetime > timezone.now()
    
    def needs_reminder(self):
        """Check if booking needs 24h reminder"""
        if self.status != 'confirmed':
            return False
        booking_datetime = timezone.make_aware(
            timezone.datetime.combine(self.booking_date, self.booking_time)
        )
        time_until = booking_datetime - timezone.now()
        return timedelta(hours=23) <= time_until <= timedelta(hours=25)


class BookingAvailability(models.Model):
    """Define available time slots and blackout dates"""
    WEEKDAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES, null=True, blank=True, help_text="Leave blank for specific date")
    specific_date = models.DateField(null=True, blank=True, help_text="For one-time availability/blackout")
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True, help_text="Uncheck to block this time slot")
    notes = models.CharField(max_length=200, blank=True)
    
    class Meta:
        verbose_name_plural = "Booking Availability"
        ordering = ['weekday', 'start_time']
    
    def __str__(self):
        if self.specific_date:
            date_str = self.specific_date.strftime('%Y-%m-%d')
        else:
            date_str = self.get_weekday_display()
        status = "Available" if self.is_available else "Blocked"
        return f"{date_str} {self.start_time}-{self.end_time} ({status})"
