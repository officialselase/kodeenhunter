from rest_framework import serializers
from .models import Category, Project, ProjectImage, Credit, Equipment, ContactSubmission, Service, Testimonial, Award


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'is_behind_the_scenes']


class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['id', 'role', 'name']


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'category']


class ProjectListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'category', 'client', 'year', 'thumbnail', 'featured', 'tags', 'view_count']
    
    def get_thumbnail(self, obj):
        if obj.thumbnail_url:
            return obj.thumbnail_url
        elif obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_tags(self, obj):
        return obj.get_tags_list()


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    credits = CreditSerializer(many=True, read_only=True)
    equipment = serializers.SerializerMethodField()
    behind_the_scenes = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    related_projects = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'client', 'year', 'duration',
            'description', 'thumbnail', 'video_url', 'video_file', 'featured',
            'images', 'credits', 'equipment', 'behind_the_scenes', 'tags',
            'view_count', 'meta_title', 'meta_description', 'related_projects'
        ]
    
    def get_thumbnail(self, obj):
        if obj.thumbnail_url:
            return obj.thumbnail_url
        elif obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_equipment(self, obj):
        return [pe.equipment.name for pe in obj.equipment_used.all()]
    
    def get_behind_the_scenes(self, obj):
        return ProjectImageSerializer(
            obj.images.filter(is_behind_the_scenes=True),
            many=True
        ).data
    
    def get_tags(self, obj):
        return obj.get_tags_list()
    
    def get_related_projects(self, obj):
        related = obj.get_related_projects()
        return ProjectListSerializer(related, many=True, context=self.context).data


class ContactSubmissionSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    budget = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    project_type = serializers.CharField(required=True)
    
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'project_type', 'budget', 'message']
    
    def validate_project_type(self, value):
        if not value or value.strip() == '':
            raise serializers.ValidationError('Please select a project type')
        return value


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'slug', 'icon', 'short_description', 'description', 'featured']


class TestimonialSerializer(serializers.ModelSerializer):
    client_photo = serializers.SerializerMethodField()
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_title', 'client_company', 'client_photo', 
                  'testimonial', 'rating', 'project_title', 'featured']
    
    def get_client_photo(self, obj):
        if obj.client_photo_url:
            return obj.client_photo_url
        elif obj.client_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.client_photo.url)
            return obj.client_photo.url
        return None


class AwardSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Award
        fields = ['id', 'title', 'organization', 'year', 'category', 'project_title', 
                  'description', 'image', 'featured']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
