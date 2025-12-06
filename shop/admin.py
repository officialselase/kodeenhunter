from django.contrib import admin
from .models import ProductCategory, Product, ProductFeature, ProductImage, Order, OrderItem, Coupon, ProductReview


class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity']


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'sale_price', 'is_digital', 'is_active', 'featured']
    list_filter = ['category', 'is_digital', 'is_active', 'featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'featured']
    inlines = [ProductFeatureInline, ProductImageInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'sale_price')
        }),
        ('Content', {
            'fields': ('short_description', 'description', 'image')
        }),
        ('Digital Product', {
            'fields': ('is_digital', 'file'),
            'classes': ('collapse',)
        }),
        ('Physical Product', {
            'fields': ('stock',),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_active', 'featured')
        }),
    )


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'times_used', 'max_uses', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['discount_type', 'is_active', 'valid_from', 'valid_until']
    search_fields = ['code']
    list_editable = ['is_active']
    readonly_fields = ['times_used']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'payment_id']
    readonly_fields = ['order_number', 'customer_name', 'customer_email', 'subtotal', 'discount', 'total', 'download_token', 'download_count', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    actions = ['mark_as_completed', 'mark_as_paid', 'generate_download_tokens']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at')
        }),
        ('Customer Details', {
            'fields': ('customer_name', 'customer_email')
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_method', 'payment_id')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'discount', 'coupon', 'total')
        }),
        ('Downloads', {
            'fields': ('download_token', 'download_count', 'max_downloads')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} order(s) marked as completed.')
    mark_as_completed.short_description = 'Mark selected orders as completed'
    
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(payment_status='paid')
        self.message_user(request, f'{updated} order(s) marked as paid.')
    mark_as_paid.short_description = 'Mark selected orders as paid'
    
    def generate_download_tokens(self, request, queryset):
        count = 0
        for order in queryset:
            if not order.download_token:
                order.generate_download_token()
                count += 1
        self.message_user(request, f'Generated download tokens for {count} order(s).')
    generate_download_tokens.short_description = 'Generate download tokens'


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'product', 'rating', 'is_verified_purchase', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'is_approved', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'title', 'review']
    list_editable = ['is_approved']
    readonly_fields = ['created_at']
    actions = ['approve_reviews', 'unapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} review(s) approved.')
    approve_reviews.short_description = 'Approve selected reviews'
    
    def unapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} review(s) unapproved.')
    unapprove_reviews.short_description = 'Unapprove selected reviews'
