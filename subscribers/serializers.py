from rest_framework import serializers
from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscribers"""
    
    class Meta:
        model = Subscriber
        fields = ['id', 'email', 'name', 'is_active', 'subscribed_at', 'source']
        read_only_fields = ['id', 'is_active', 'subscribed_at']
    
    def validate_email(self, value):
        """Validate email format and check for existing active subscriptions"""
        value = value.lower().strip()
        
        # Check if already actively subscribed (allow resubscribe if inactive)
        if self.instance is None:  # Only check on creation
            existing = Subscriber.objects.filter(email=value, is_active=True).first()
            if existing:
                raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        
        return value


class UnsubscribeSerializer(serializers.Serializer):
    """Serializer for unsubscribe requests"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        value = value.lower().strip()
        return value
