from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Subscriber
from .serializers import SubscriberSerializer, UnsubscribeSerializer


class SubscribeView(generics.CreateAPIView):
    """Subscribe to newsletter"""
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if email was previously unsubscribed and reactivate
        email = serializer.validated_data['email']
        existing = Subscriber.objects.filter(email=email).first()
        
        if existing and not existing.is_active:
            # Reactivate subscription
            existing.is_active = True
            existing.unsubscribed_at = None
            existing.save()
            return Response(
                {'message': 'Successfully resubscribed to newsletter!'},
                status=status.HTTP_200_OK
            )
        
        self.perform_create(serializer)
        return Response(
            {'message': 'Successfully subscribed to newsletter!'},
            status=status.HTTP_201_CREATED
        )


@api_view(['POST'])
def unsubscribe_view(request):
    """Unsubscribe from newsletter"""
    serializer = UnsubscribeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email = serializer.validated_data['email']
    subscriber = get_object_or_404(Subscriber, email=email, is_active=True)
    
    subscriber.unsubscribe()
    
    return Response(
        {'message': 'Successfully unsubscribed from newsletter.'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def subscriber_status(request):
    """Check subscription status by email (query param)"""
    email = request.query_params.get('email', '').lower().strip()
    
    if not email:
        return Response(
            {'error': 'Email parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    subscriber = Subscriber.objects.filter(email=email).first()
    
    if not subscriber:
        return Response({'subscribed': False})
    
    return Response({
        'subscribed': subscriber.is_active,
        'subscribed_at': subscriber.subscribed_at if subscriber.is_active else None
    })
