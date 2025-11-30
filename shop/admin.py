from django.contrib import admin
from .models import ProductCategory, Product, ProductFeature, ProductImage, Order, OrderItem


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


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'status', 'total', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email']
    readonly_fields = ['order_number', 'customer_name', 'customer_email', 'subtotal', 'total', 'created_at']
    inlines = [OrderItemInline]
    
    def has_add_permission(self, request):
        return False
