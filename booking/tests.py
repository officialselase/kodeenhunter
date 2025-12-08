from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from decimal import Decimal
from .models import BookingService, Booking


class BookingServiceModelTest(TestCase):
    """Test BookingService model"""
    
    def setUp(self):
        self.service = BookingService.objects.create(
            name='Test Service',
            slug='test-service',
            description='Test description',
            duration_hours=Decimal('1.0'),
            price=Decimal('100.00')
        )
    
    def test_service_creation(self):
        """Test service is created correctly"""
        self.assertEqual(self.service.name, 'Test Service')
        self.assertEqual(self.service.duration_hours, Decimal('1.0'))
        self.assertEqual(str(self.service), 'Test Service')


class BookingAPITest(APITestCase):
    """Test Booking API endpoints"""
    
    def setUp(self):
        self.service = BookingService.objects.create(
            name='Test Service',
            slug='test-service',
            description='Test description',
            duration_hours=Decimal('1.0'),
            price=Decimal('100.00')
        )
    
    def test_get_services(self):
        """Test GET /api/booking/services/"""
        url = reverse('bookingservice-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Service')
    
    def test_create_booking(self):
        """Test POST /api/booking/bookings/"""
        url = reverse('booking-list')
        booking_date = (datetime.now() + timedelta(days=7)).date()
        
        data = {
            'service': self.service.id,
            'date': booking_date.isoformat(),
            'time': '14:00:00',
            'customer_name': 'John Doe',
            'customer_email': 'john@example.com',
            'customer_phone': '+1234567890',
            'notes': 'Test booking'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        
        booking = Booking.objects.first()
        self.assertEqual(booking.customer_name, 'John Doe')
        self.assertEqual(booking.status, 'pending')
    
    def test_booking_validation(self):
        """Test booking validation"""
        url = reverse('booking-list')
        past_date = (datetime.now() - timedelta(days=1)).date()
        
        data = {
            'service': self.service.id,
            'date': past_date.isoformat(),
            'time': '14:00:00',
            'customer_name': 'John Doe',
            'customer_email': 'john@example.com',
            'customer_phone': '+1234567890'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_available_slots(self):
        """Test GET /api/booking/bookings/available_slots/"""
        url = reverse('booking-available-slots')
        date = (datetime.now() + timedelta(days=7)).date()
        
        response = self.client.get(url, {'date': date.isoformat()})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('available_slots', response.data)
        self.assertIsInstance(response.data['available_slots'], list)
