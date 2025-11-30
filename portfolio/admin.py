from django.contrib import admin
from .models import Category, Project, ProjectImage, Credit, Equipment, ProjectEquipment, ContactSubmission


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
    list_display = ['title', 'category', 'client', 'year', 'featured', 'order']
    list_filter = ['category', 'featured', 'year']
    search_fields = ['title', 'client', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['featured', 'order']
    inlines = [ProjectImageInline, CreditInline, ProjectEquipmentInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category', 'client', 'year')
        }),
        ('Media', {
            'fields': ('thumbnail', 'video_url', 'video_file', 'duration')
        }),
        ('Content', {
            'fields': ('description',)
        }),
        ('Settings', {
            'fields': ('featured', 'order')
        }),
    )


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
