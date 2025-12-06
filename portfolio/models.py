from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='projects')
    client = models.CharField(max_length=200, blank=True)
    year = models.PositiveIntegerField()
    duration = models.CharField(max_length=20, blank=True, help_text="e.g., 4:32")
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='portfolio/thumbnails/', blank=True)
    thumbnail_url = models.URLField(blank=True, help_text="External image URL (Unsplash, etc.)")
    video_url = models.URLField(blank=True, help_text="YouTube or Vimeo URL")
    video_file = models.FileField(upload_to='portfolio/videos/', blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    # SEO fields
    meta_title = models.CharField(max_length=200, blank=True, help_text="SEO title (leave blank to use project title)")
    meta_description = models.TextField(max_length=300, blank=True, help_text="SEO description for search engines")
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0, help_text="Number of times this project has been viewed")
    
    # Tags for filtering and search
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags (e.g., commercial, music video, drone)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-year', 'order']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['featured', '-year']),
            models.Index(fields=['-view_count']),
        ]

    def __str__(self):
        return self.title
    
    def increment_view_count(self):
        """Increment the view counter for this project"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []
    
    def get_related_projects(self, limit=3):
        """Get related projects based on category and tags"""
        related = Project.objects.filter(category=self.category).exclude(id=self.id)
        if self.tags:
            # Could implement more sophisticated tag matching here
            pass
        return related[:limit]


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='portfolio/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    is_behind_the_scenes = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"


class Credit(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='credits')
    role = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.role}: {self.name}"


class Equipment(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True)
    
    class Meta:
        verbose_name_plural = "Equipment"

    def __str__(self):
        return self.name


class ProjectEquipment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='equipment_used')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Project Equipment"

    def __str__(self):
        return f"{self.project.title} - {self.equipment.name}"


class ContactSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    project_type = models.CharField(max_length=100)
    budget = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.project_type}"


class Service(models.Model):
    """Services offered (videography, editing, color grading, etc.)"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, help_text="Lucide icon name (e.g., Video, Film, Palette)")
    short_description = models.CharField(max_length=200)
    description = models.TextField()
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Testimonial(models.Model):
    """Client testimonials"""
    client_name = models.CharField(max_length=200)
    client_title = models.CharField(max_length=200, blank=True, help_text="e.g., CEO at Company")
    client_company = models.CharField(max_length=200, blank=True)
    client_photo = models.ImageField(upload_to='testimonials/', blank=True)
    client_photo_url = models.URLField(blank=True, help_text="External image URL")
    testimonial = models.TextField()
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonials')
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.client_name} - {self.client_company}"


class Award(models.Model):
    """Awards and recognition"""
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    category = models.CharField(max_length=200, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='awards')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='awards/', blank=True)
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-year', 'order']
    
    def __str__(self):
        return f"{self.title} ({self.year})"
