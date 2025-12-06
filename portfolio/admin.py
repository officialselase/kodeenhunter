from django.contrib import admin
from .models import Category, Project, ProjectImage, Credit, Equipment, ProjectEquipment, ContactSubmission, Service, Testimonial, Award


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


class CreditInline(admin.TabularInline):
    model = Credit
    extra = 1


class ProjectEquipmentInline(admin.TabularInline):
    model = ProjectEquipment
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'client', 'year', 'view_count', 'featured', 'order']
    list_filter = ['category', 'featured', 'year']
    search_fields = ['title', 'client', 'description', 'tags']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['featured', 'order']
    inlines = [ProjectImageInline, CreditInline, ProjectEquipmentInline]
    actions = ['mark_as_featured', 'mark_as_not_featured', 'reset_view_count']
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category', 'client', 'year')
        }),
        ('Media', {
            'fields': ('thumbnail', 'thumbnail_url', 'video_url', 'video_file', 'duration')
        }),
        ('Content', {
            'fields': ('description', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Analytics', {
            'fields': ('view_count',),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('featured', 'order')
        }),
    )
    readonly_fields = ['view_count']
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} project(s) marked as featured.')
    mark_as_featured.short_description = 'Mark selected projects as featured'
    
    def mark_as_not_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f'{updated} project(s) unmarked as featured.')
    mark_as_not_featured.short_description = 'Remove featured status'
    
    def reset_view_count(self, request, queryset):
        updated = queryset.update(view_count=0)
        self.message_user(request, f'View count reset for {updated} project(s).')
    reset_view_count.short_description = 'Reset view count to 0'


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    list_filter = ['category']
    search_fields = ['name']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'project_type', 'created_at', 'is_read']
    list_filter = ['project_type', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['name', 'email', 'project_type', 'budget', 'message', 'created_at']
    list_editable = ['is_read']
    
    def has_add_permission(self, request):
        return False


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'featured', 'order']
    list_filter = ['featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['featured', 'order']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'rating', 'project', 'featured', 'order']
    list_filter = ['rating', 'featured', 'created_at']
    search_fields = ['client_name', 'client_company', 'testimonial']
    list_editable = ['featured', 'order']


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'year', 'project', 'featured', 'order']
    list_filter = ['year', 'featured', 'organization']
    search_fields = ['title', 'organization', 'description']
    list_editable = ['featured', 'order']
