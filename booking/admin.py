from django.contrib import admin
from django.utils import timezone
from .models import BookingService, Booking, BookingAvailability


@admin.register(BookingService)
class BookingServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'duration_hours', 'price', 'is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'order']
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description')
        }),
        ('Service Details', {
            'fields': ('duration_hours', 'price')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_number', 'customer_name', 'service', 'booking_date', 'booking_time', 'status', 'deposit_paid']
    list_filter = ['status', 'deposit_paid', 'booking_date', 'service']
    search_fields = ['booking_number', 'customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['booking_number', 'created_at', 'updated_at', 'confirmed_at']
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    date_hierarchy = 'booking_date'
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_number', 'service', 'status')
        }),
        ('Customer Details', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Schedule', {
            'fields': ('booking_date', 'booking_time', 'duration_hours', 'location')
        }),
        ('Additional Information', {
            'fields': ('message', 'admin_notes')
        }),
        ('Payment', {
            'fields': ('price', 'deposit_paid')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'confirmed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='confirmed',
            confirmed_at=timezone.now()
        )
        self.message_user(request, f'{updated} booking(s) confirmed.')
    mark_as_confirmed.short_description = 'Mark selected bookings as confirmed'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} booking(s) marked as completed.')
    mark_as_completed.short_description = 'Mark selected bookings as completed'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} booking(s) cancelled.')
    mark_as_cancelled.short_description = 'Cancel selected bookings'


@admin.register(BookingAvailability)
class BookingAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['get_date_display', 'start_time', 'end_time', 'is_available', 'notes']
    list_filter = ['is_available', 'weekday']
    list_editable = ['is_available']
    
    def get_date_display(self, obj):
        if obj.specific_date:
            return obj.specific_date.strftime('%Y-%m-%d')
        return obj.get_weekday_display() if obj.weekday is not None else 'N/A'
    get_date_display.short_description = 'Date/Day'
