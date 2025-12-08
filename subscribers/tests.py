from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Subscriber


class SubscriberModelTest(TestCase):
    """Test Subscriber model"""
    
    def test_create_subscriber(self):
        """Test creating a subscriber"""
        subscriber = Subscriber.objects.create(
            email='test@example.com',
            name='Test User'
        )
        self.assertEqual(subscriber.email, 'test@example.com')
        self.assertTrue(subscriber.is_active)
        self.assertIsNotNone(subscriber.subscribed_at)
    
    def test_unsubscribe(self):
        """Test unsubscribe method"""
        subscriber = Subscriber.objects.create(email='test@example.com')
        subscriber.unsubscribe()
        self.assertFalse(subscriber.is_active)
        self.assertIsNotNone(subscriber.unsubscribed_at)


class SubscriberAPITest(APITestCase):
    """Test Subscriber API endpoints"""
    
    def test_subscribe(self):
        """Test subscribing to newsletter"""
        url = reverse('subscribers:subscribe')
        data = {'email': 'newuser@example.com', 'name': 'New User'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscriber.objects.filter(email='newuser@example.com').exists())
    
    def test_duplicate_subscription(self):
        """Test subscribing with existing email"""
        Subscriber.objects.create(email='existing@example.com')
        
        url = reverse('subscribers:subscribe')
        data = {'email': 'existing@example.com'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_resubscribe(self):
        """Test resubscribing after unsubscribing"""
        subscriber = Subscriber.objects.create(email='test@example.com')
        subscriber.unsubscribe()
        
        url = reverse('subscribers:subscribe')
        data = {'email': 'test@example.com'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        subscriber.refresh_from_db()
        self.assertTrue(subscriber.is_active)
    
    def test_unsubscribe(self):
        """Test unsubscribing from newsletter"""
        Subscriber.objects.create(email='test@example.com')
        
        url = reverse('subscribers:unsubscribe')
        data = {'email': 'test@example.com'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        subscriber = Subscriber.objects.get(email='test@example.com')
        self.assertFalse(subscriber.is_active)
    
    def test_subscriber_status(self):
        """Test checking subscription status"""
        Subscriber.objects.create(email='active@example.com')
        
        url = reverse('subscribers:status')
        response = self.client.get(url, {'email': 'active@example.com'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['subscribed'])
    
    def test_subscriber_status_not_found(self):
        """Test checking status for non-existent email"""
        url = reverse('subscribers:status')
        response = self.client.get(url, {'email': 'notfound@example.com'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['subscribed'])
