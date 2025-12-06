from rest_framework import serializers
from .models import ProductCategory, Product, ProductFeature, ProductImage, Order, OrderItem, Coupon, ProductReview


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug']


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['id', 'feature']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


class ProductListSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    features = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'price', 'sale_price',
            'current_price', 'short_description', 'image', 'is_digital', 'featured', 'features'
        ]
    
    def get_features(self, obj):
        return [f.feature for f in obj.features.all()]


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['id', 'customer_name', 'rating', 'title', 'review', 'is_verified_purchase', 'created_at']
        read_only_fields = ['is_verified_purchase', 'created_at']


class ProductDetailSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    features = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'price', 'sale_price',
            'current_price', 'description', 'short_description', 'image',
            'is_digital', 'featured', 'features', 'images', 'stock',
            'reviews', 'average_rating', 'review_count'
        ]
    
    def get_features(self, obj):
        return [f.feature for f in obj.features.all()]
    
    def get_reviews(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)[:5]
        return ProductReviewSerializer(approved_reviews, many=True).data
    
    def get_average_rating(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)
        if approved_reviews.exists():
            return round(sum(r.rating for r in approved_reviews) / approved_reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'price', 'quantity', 'total']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount_type', 'discount_value']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    coupon_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_email', 'items', 'coupon_code', 'notes'
        ]
    
    def validate_coupon_code(self, value):
        if value:
            try:
                coupon = Coupon.objects.get(code=value.upper())
                if not coupon.is_valid():
                    raise serializers.ValidationError("This coupon is not valid or has expired.")
                return coupon
            except Coupon.DoesNotExist:
                raise serializers.ValidationError("Invalid coupon code.")
        return None
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon = validated_data.pop('coupon_code', None)
        
        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in items_data)
        discount = 0
        
        if coupon:
            discount = coupon.calculate_discount(subtotal)
            validated_data['coupon'] = coupon
            coupon.times_used += 1
            coupon.save()
        
        validated_data['subtotal'] = subtotal
        validated_data['discount'] = discount
        validated_data['total'] = subtotal - discount
        
        # Generate order number
        from django.utils import timezone
        import uuid
        validated_data['order_number'] = f"ORD{timezone.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
        
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        # Generate download token for digital products
        order.generate_download_token()
        
        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email',
            'status', 'payment_status', 'subtotal', 'discount', 'total', 
            'items', 'download_token', 'created_at'
        ]
        read_only_fields = ['order_number', 'download_token']
