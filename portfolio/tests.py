from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Project, Category, ContactSubmission


class ProjectModelTest(TestCase):
    """Test Project model"""
    
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            description='Test description',
            category=self.category,
            year=2024
        )
    
    def test_project_creation(self):
        """Test project is created correctly"""
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.slug, 'test-project')
        self.assertEqual(str(self.project), 'Test Project')
    
    def test_project_category_relationship(self):
        """Test project-category relationship"""
        self.assertEqual(self.project.category, self.category)
        self.assertIn(self.project, self.category.projects.all())


class ProjectAPITest(APITestCase):
    """Test Project API endpoints"""
    
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.project = Project.objects.create(
            title='Test Project',
            slug='test-project',
            description='Test description',
            category=self.category,
            year=2024,
            featured=True
        )
    
    def test_get_projects_list(self):
        """Test GET /api/portfolio/projects/"""
        url = reverse('project-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Project')
    
    def test_get_project_detail(self):
        """Test GET /api/portfolio/projects/{slug}/"""
        url = reverse('project-detail', kwargs={'slug': 'test-project'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Project')
    
    def test_get_featured_projects(self):
        """Test GET /api/portfolio/projects/featured/"""
        url = reverse('project-featured')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['featured'])


class ContactSubmissionTest(APITestCase):
    """Test Contact form submission"""
    
    def test_contact_submission(self):
        """Test POST /api/portfolio/contact/"""
        url = reverse('contact-submission')
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'subject': 'Test Subject',
            'message': 'Test message'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactSubmission.objects.count(), 1)
        self.assertEqual(ContactSubmission.objects.first().name, 'John Doe')
    
    def test_contact_submission_validation(self):
        """Test contact form validation"""
        url = reverse('contact-submission')
        data = {
            'name': 'John Doe',
            'email': 'invalid-email',
            'subject': 'Test',
            'message': 'Test'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
