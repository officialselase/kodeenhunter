from django.contrib import admin
from .models import Subscriber


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_active', 'subscribed_at', 'source']
    list_filter = ['is_active', 'source', 'subscribed_at']
    search_fields = ['email', 'name']
    readonly_fields = ['subscribed_at', 'unsubscribed_at']
    date_hierarchy = 'subscribed_at'
    
    fieldsets = (
        ('Subscriber Information', {
            'fields': ('email', 'name', 'source')
        }),
        ('Status', {
            'fields': ('is_active', 'subscribed_at', 'unsubscribed_at')
        }),
    )
    
    actions = ['activate_subscribers', 'deactivate_subscribers']
    
    def activate_subscribers(self, request, queryset):
        """Bulk activate subscribers"""
        count = queryset.update(is_active=True, unsubscribed_at=None)
        self.message_user(request, f'{count} subscriber(s) activated.')
    activate_subscribers.short_description = 'Activate selected subscribers'
    
    def deactivate_subscribers(self, request, queryset):
        """Bulk deactivate subscribers"""
        from django.utils import timezone
        count = 0
        for subscriber in queryset:
            if subscriber.is_active:
                subscriber.unsubscribe()
                count += 1
        self.message_user(request, f'{count} subscriber(s) deactivated.')
    deactivate_subscribers.short_description = 'Deactivate selected subscribers'
