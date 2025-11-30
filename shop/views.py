from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ProductCategory, Product, Order, OrderItem
from .serializers import (
    ProductCategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    OrderSerializer
)
import uuid


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured:
            queryset = queryset.filter(featured=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(featured=True)[:6]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ViewSet):
    def create(self, request):
        items = request.data.get('items', [])
        customer_name = request.data.get('customer_name')
        customer_email = request.data.get('customer_email')
        
        if not items or not customer_name or not customer_email:
            return Response(
                {'error': 'Please provide customer details and cart items'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order_number = f"KH-{uuid.uuid4().hex[:8].upper()}"
        subtotal = 0
        order_items = []
        
        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'], is_active=True)
                quantity = item.get('quantity', 1)
                price = product.current_price
                subtotal += price * quantity
                order_items.append({
                    'product': product,
                    'product_name': product.name,
                    'price': price,
                    'quantity': quantity
                })
            except Product.DoesNotExist:
                continue
        
        if not order_items:
            return Response(
                {'error': 'No valid products in cart'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order = Order.objects.create(
            order_number=order_number,
            customer_name=customer_name,
            customer_email=customer_email,
            subtotal=subtotal,
            total=subtotal
        )
        
        for item in order_items:
            OrderItem.objects.create(order=order, **item)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
