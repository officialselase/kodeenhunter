#!/usr/bin/env python
"""Populate newsletter subscribers for testing"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from subscribers.models import Subscriber

def populate():
    """Create sample newsletter subscribers"""
    
    # Clear existing subscribers
    Subscriber.objects.all().delete()
    print("Cleared existing subscribers")
    
    # Active subscribers
    subscribers = [
        {'email': 'john.doe@example.com', 'name': 'John Doe', 'source': 'website'},
        {'email': 'jane.smith@example.com', 'name': 'Jane Smith', 'source': 'website'},
        {'email': 'filmmaker@example.com', 'name': 'Pro Filmmaker', 'source': 'shop'},
        {'email': 'photographer@example.com', 'name': 'Sarah Photo', 'source': 'portfolio'},
        {'email': 'creative@example.com', 'name': 'Creative Director', 'source': 'website'},
    ]
    
    for data in subscribers:
        subscriber = Subscriber.objects.create(**data)
        print(f"✓ Created subscriber: {subscriber.email}")
    
    # Create one unsubscribed user
    unsubscribed = Subscriber.objects.create(
        email='unsubscribed@example.com',
        name='Former Subscriber',
        source='website'
    )
    unsubscribed.unsubscribe()
    print(f"✓ Created unsubscribed user: {unsubscribed.email}")
    
    # Summary
    active_count = Subscriber.objects.filter(is_active=True).count()
    inactive_count = Subscriber.objects.filter(is_active=False).count()
    
    print(f"\n{'='*50}")
    print(f"Newsletter Subscribers Summary:")
    print(f"{'='*50}")
    print(f"Active subscribers: {active_count}")
    print(f"Unsubscribed: {inactive_count}")
    print(f"Total: {active_count + inactive_count}")
    print(f"{'='*50}\n")

if __name__ == '__main__':
    populate()
