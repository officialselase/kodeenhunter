from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from .models import Product, ProductCategory, Order, OrderItem


class ProductModelTest(TestCase):
    """Test Product model"""
    
    def setUp(self):
        self.category = ProductCategory.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            description='Test description',
            price=Decimal('29.99'),
            category=self.category
        )
    
    def test_product_creation(self):
        """Test product is created correctly"""
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.price, Decimal('29.99'))
        self.assertEqual(str(self.product), 'Test Product')
    
    def test_product_category_relationship(self):
        """Test product-category relationship"""
        self.assertEqual(self.product.category, self.category)
        self.assertIn(self.product, self.category.products.all())


class ProductAPITest(APITestCase):
    """Test Product API endpoints"""
    
    def setUp(self):
        self.category = ProductCategory.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            description='Test description',
            price=Decimal('29.99'),
            category=self.category,
            featured=True
        )
    
    def test_get_products_list(self):
        """Test GET /api/shop/products/"""
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Product')
    
    def test_get_product_detail(self):
        """Test GET /api/shop/products/{slug}/"""
        url = reverse('product-detail', kwargs={'slug': 'test-product'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')
    
    def test_get_featured_products(self):
        """Test GET /api/shop/products/featured/"""
        url = reverse('product-featured')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['featured'])


class OrderAPITest(APITestCase):
    """Test Order API endpoints"""
    
    def setUp(self):
        self.category = ProductCategory.objects.create(
            name='Test Category',
            slug='test-category'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            description='Test description',
            price=Decimal('29.99'),
            category=self.category
        )
    
    def test_create_order(self):
        """Test POST /api/shop/orders/"""
        url = reverse('orders-list')
        data = {
            'customer_name': 'John Doe',
            'customer_email': 'john@example.com',
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 2
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        
        order = Order.objects.first()
        self.assertEqual(order.customer_name, 'John Doe')
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.total_amount, Decimal('59.98'))
    
    def test_order_validation(self):
        """Test order validation"""
        url = reverse('orders-list')
        data = {
            'customer_name': 'John Doe',
            'customer_email': 'invalid-email',
            'items': []
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
