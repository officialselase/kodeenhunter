from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.conf import settings
from .models import Category, Project, ContactSubmission, Service, Testimonial, Award
from .serializers import (
    CategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ContactSubmissionSerializer,
    ServiceSerializer,
    TestimonialSerializer,
    AwardSerializer
)

# Cache timeout from settings (default 5 minutes)
CACHE_TTL = getattr(settings, 'API_CACHE_TIMEOUT', 300)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.select_related('category').prefetch_related('images', 'credits', 'equipment_used__equipment')
    lookup_field = 'slug'
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['year', 'view_count', 'created_at']
    ordering = ['-featured', '-year']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.select_related('category').prefetch_related('images', 'credits', 'equipment_used__equipment')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search')
        tags = self.request.query_params.get('tags')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured:
            queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(client__icontains=search) |
                Q(tags__icontains=search)
            )
        if tags:
            # Search for projects with any of the specified tags
            tag_list = [tag.strip() for tag in tags.split(',')]
            query = Q()
            for tag in tag_list:
                query |= Q(tags__icontains=tag)
            queryset = queryset.filter(query)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count when project is viewed
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @method_decorator(cache_page(CACHE_TTL))
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_projects = self.get_queryset().filter(featured=True)[:3]
        serializer = ProjectListSerializer(featured_projects, many=True, context={'request': request})
        return Response(serializer.data)
    
    @method_decorator(cache_page(CACHE_TTL))
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most viewed projects"""
        popular_projects = Project.objects.select_related('category').order_by('-view_count')[:6]
        serializer = ProjectListSerializer(popular_projects, many=True, context={'request': request})
        return Response(serializer.data)


class ContactSubmissionView(generics.CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Thank you for your message! I will get back to you soon.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(featured=True)
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    
    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(featured=True).select_related('project')
    serializer_class = TestimonialSerializer
    
    @method_decorator(cache_page(CACHE_TTL))
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured testimonials for homepage"""
        featured = self.get_queryset()[:6]
        serializer = self.get_serializer(featured, many=True, context={'request': request})
        return Response(serializer.data)


class AwardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Award.objects.filter(featured=True).select_related('project')
    serializer_class = AwardSerializer
    
    @method_decorator(cache_page(CACHE_TTL))
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured awards for homepage"""
        featured = self.get_queryset()[:4]
        serializer = self.get_serializer(featured, many=True, context={'request': request})
        return Response(serializer.data)
