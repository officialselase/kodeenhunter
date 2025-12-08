from django.db import models
from django.utils import timezone


class Subscriber(models.Model):
    """Newsletter subscriber model"""
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(default=timezone.now)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    source = models.CharField(
        max_length=50,
        default='website',
        help_text='Where the subscriber signed up from'
    )
    
    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
    
    def __str__(self):
        return f"{self.email} ({'Active' if self.is_active else 'Unsubscribed'})"
    
    def unsubscribe(self):
        """Unsubscribe the user"""
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save()
