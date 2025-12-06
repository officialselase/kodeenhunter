from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.conf import settings
from .models import ProductCategory, Product, Order, OrderItem, Coupon, ProductReview
from .serializers import (
    ProductCategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    CouponSerializer,
    ProductReviewSerializer
)

# Cache timeout from settings
CACHE_TTL = getattr(settings, 'API_CACHE_TIMEOUT', 300)


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    lookup_field = 'slug'
    
    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('features', 'images', 'reviews')
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured:
            queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(description__icontains=search)
        
        return queryset
    
    @method_decorator(cache_page(CACHE_TTL))
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(featured=True)[:6]
        serializer = ProductListSerializer(featured_products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def review(self, request, slug=None):
        """Submit a review for a product"""
        product = self.get_object()
        serializer = ProductReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(
                {'message': 'Thank you for your review! It will be published after approval.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    lookup_field = 'order_number'
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all()
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(customer_email=email)
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            # TODO: Send order confirmation email
            # TODO: Process payment (Stripe/PayPal integration)
            return Response(
                {
                    'message': 'Order created successfully! Check your email for payment instructions.',
                    'order': OrderSerializer(order).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def download(self, request, order_number=None):
        """Download digital products for an order"""
        order = self.get_object()
        token = request.query_params.get('token')
        
        if not token or token != order.download_token:
            return Response(
                {'error': 'Invalid download token'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not order.can_download():
            return Response(
                {'error': 'Download limit reached or payment not confirmed'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get digital products from order
        digital_items = order.items.filter(product__is_digital=True, product__file__isnull=False)
        
        if not digital_items.exists():
            return Response(
                {'error': 'No digital products in this order'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # For simplicity, return download links
        # In production, you'd want to serve files securely or create a zip
        downloads = []
        for item in digital_items:
            if item.product and item.product.file:
                downloads.append({
                    'product': item.product_name,
                    'url': request.build_absolute_uri(item.product.file.url)
                })
        
        # Increment download count
        order.download_count += 1
        order.save(update_fields=['download_count'])
        
        return Response({
            'downloads': downloads,
            'remaining_downloads': order.max_downloads - order.download_count
        })


class CouponValidateView(generics.GenericAPIView):
    """Validate a coupon code"""
    serializer_class = CouponSerializer
    
    def post(self, request):
        code = request.data.get('code', '').upper()
        subtotal = request.data.get('subtotal', 0)
        
        try:
            coupon = Coupon.objects.get(code=code)
            
            if not coupon.is_valid():
                return Response(
                    {'error': 'This coupon is not valid or has expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if subtotal < coupon.min_purchase:
                return Response(
                    {'error': f'Minimum purchase of ${coupon.min_purchase} required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            discount = coupon.calculate_discount(float(subtotal))
            
            return Response({
                'valid': True,
                'code': coupon.code,
                'discount': discount,
                'discount_type': coupon.discount_type,
                'discount_value': coupon.discount_value
            })
            
        except Coupon.DoesNotExist:
            return Response(
                {'error': 'Invalid coupon code'},
                status=status.HTTP_404_NOT_FOUND
            )
