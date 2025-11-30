from rest_framework import serializers
from .models import Category, Project, ProjectImage, Credit, Equipment, ContactSubmission


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
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'category', 'client', 'year', 'thumbnail', 'featured']


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    credits = CreditSerializer(many=True, read_only=True)
    equipment = serializers.SerializerMethodField()
    behind_the_scenes = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'category', 'client', 'year', 'duration',
            'description', 'thumbnail', 'video_url', 'video_file', 'featured',
            'images', 'credits', 'equipment', 'behind_the_scenes'
        ]
    
    def get_equipment(self, obj):
        return [pe.equipment.name for pe in obj.equipment_used.all()]
    
    def get_behind_the_scenes(self, obj):
        return ProjectImageSerializer(
            obj.images.filter(is_behind_the_scenes=True),
            many=True
        ).data


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'project_type', 'budget', 'message']
