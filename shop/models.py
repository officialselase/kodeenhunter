from django.db import models


class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='shop/products/')
    file = models.FileField(upload_to='shop/downloads/', blank=True, help_text="Digital product file")
    is_digital = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    stock = models.PositiveIntegerField(default=0, help_text="For physical products")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['featured', '-created_at']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    @property
    def current_price(self):
        return self.sale_price if self.sale_price else self.price


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
    feature = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - {self.feature}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='shop/gallery/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductReview(models.Model):
    """Customer reviews for products"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)], help_text="Rating from 1 to 5")
    title = models.CharField(max_length=200)
    review = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False, help_text="Approve to show on site")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['is_approved']),
        ]
    
    def __str__(self):
        return f"{self.customer_name} - {self.product.name} ({self.rating}★)"


class Coupon(models.Model):
    """Discount coupons for shop"""
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(
        max_length=20,
        choices=[('percentage', 'Percentage'), ('fixed', 'Fixed Amount')],
        default='percentage'
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Minimum purchase amount")
    max_uses = models.PositiveIntegerField(null=True, blank=True, help_text="Leave blank for unlimited")
    times_used = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.code
    
    def is_valid(self):
        """Check if coupon is currently valid"""
        from django.utils import timezone
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.max_uses and self.times_used >= self.max_uses:
            return False
        return True
    
    def calculate_discount(self, subtotal):
        """Calculate discount amount for given subtotal"""
        if not self.is_valid() or subtotal < self.min_purchase:
            return 0
        
        if self.discount_type == 'percentage':
            return subtotal * (self.discount_value / 100)
        else:
            return min(self.discount_value, subtotal)


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    order_number = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment information
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, blank=True, help_text="e.g., Stripe, PayPal")
    payment_id = models.CharField(max_length=200, blank=True, help_text="Payment gateway transaction ID")
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
    # Download tracking
    download_token = models.CharField(max_length=100, blank=True, unique=True, help_text="Unique token for download access")
    download_count = models.PositiveIntegerField(default=0)
    max_downloads = models.PositiveIntegerField(default=3, help_text="Maximum number of downloads allowed")
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['customer_email']),
            models.Index(fields=['payment_status']),
        ]

    def __str__(self):
        return f"Order {self.order_number}"
    
    def generate_download_token(self):
        """Generate unique download token"""
        import uuid
        self.download_token = uuid.uuid4().hex
        self.save(update_fields=['download_token'])
        return self.download_token
    
    def can_download(self):
        """Check if customer can still download"""
        return self.payment_status == 'paid' and self.download_count < self.max_downloads


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    @property
    def total(self):
        return self.price * self.quantity
