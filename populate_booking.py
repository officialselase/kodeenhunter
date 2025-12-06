#!/usr/bin/env python
"""Populate booking services with sample data"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from booking.models import BookingService, BookingAvailability
from datetime import time

def populate_booking_services():
    """Create sample booking services"""
    
    services = [
        {
            'name': 'Music Video Production',
            'slug': 'music-video-production',
            'description': 'Full-service music video production including concept development, filming, and post-production. Perfect for artists looking to create professional visual content.',
            'duration_hours': 8.0,
            'price': 2500.00,
            'order': 1,
        },
        {
            'name': 'Commercial Video Shoot',
            'slug': 'commercial-video-shoot',
            'description': 'Professional commercial video production for brands and businesses. Includes pre-production planning, on-location filming, and editing.',
            'duration_hours': 6.0,
            'price': 1800.00,
            'order': 2,
        },
        {
            'name': 'Event Coverage',
            'slug': 'event-coverage',
            'description': 'Comprehensive event videography capturing all the important moments. Ideal for weddings, corporate events, and special occasions.',
            'duration_hours': 4.0,
            'price': 1200.00,
            'order': 3,
        },
        {
            'name': 'Portrait/Interview Session',
            'slug': 'portrait-interview-session',
            'description': 'Professional portrait and interview filming with cinematic lighting and composition. Great for testimonials, profiles, and documentary content.',
            'duration_hours': 2.0,
            'price': 600.00,
            'order': 4,
        },
        {
            'name': 'Consultation Call',
            'slug': 'consultation-call',
            'description': 'One-on-one consultation to discuss your project vision, requirements, and creative direction. Perfect for planning larger productions.',
            'duration_hours': 1.0,
            'price': 150.00,
            'order': 5,
        },
    ]
    
    print("Creating booking services...")
    for service_data in services:
        service, created = BookingService.objects.get_or_create(
            slug=service_data['slug'],
            defaults=service_data
        )
        if created:
            print(f"✓ Created: {service.name}")
        else:
            print(f"- Already exists: {service.name}")
    
    print(f"\nTotal services: {BookingService.objects.count()}")


def populate_availability():
    """Create default availability schedule"""
    
    # Monday to Friday: 9 AM - 5 PM
    weekdays = [0, 1, 2, 3, 4]  # Monday to Friday
    
    print("\nCreating availability schedule...")
    for weekday in weekdays:
        availability, created = BookingAvailability.objects.get_or_create(
            weekday=weekday,
            start_time=time(9, 0),
            end_time=time(17, 0),
            defaults={
                'is_available': True,
                'notes': 'Regular business hours'
            }
        )
        if created:
            day_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][weekday]
            print(f"✓ Created availability: {day_name} 9:00 AM - 5:00 PM")
    
    # Saturday: 10 AM - 3 PM
    availability, created = BookingAvailability.objects.get_or_create(
        weekday=5,  # Saturday
        start_time=time(10, 0),
        end_time=time(15, 0),
        defaults={
            'is_available': True,
            'notes': 'Weekend hours'
        }
    )
    if created:
        print(f"✓ Created availability: Saturday 10:00 AM - 3:00 PM")
    
    print(f"\nTotal availability rules: {BookingAvailability.objects.count()}")


if __name__ == '__main__':
    print("=" * 60)
    print("POPULATING BOOKING DATABASE")
    print("=" * 60)
    
    populate_booking_services()
    populate_availability()
    
    print("\n" + "=" * 60)
    print("✅ BOOKING DATABASE POPULATED SUCCESSFULLY!")
    print("=" * 60)
    print("\nYou can now:")
    print("1. Start the backend: python manage.py runserver 8000")
    print("2. Start the frontend: cd frontend && npm run dev")
    print("3. Click the floating calendar button to test booking")
    print("=" * 60)
