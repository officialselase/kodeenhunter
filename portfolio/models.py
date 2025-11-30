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
    thumbnail = models.ImageField(upload_to='portfolio/thumbnails/')
    video_url = models.URLField(blank=True, help_text="YouTube or Vimeo URL")
    video_file = models.FileField(upload_to='portfolio/videos/', blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-year', 'order']

    def __str__(self):
        return self.title


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
