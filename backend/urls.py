"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.views.decorators.http import require_GET

@require_GET
def robots_txt(request):
    """Serve robots.txt"""
    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        "Sitemap: https://kodeenhunter.com/sitemap.xml",
        "",
        "Disallow: /admin/",
        "Disallow: /api/",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

@require_GET
def sitemap_xml(request):
    """Generate sitemap.xml dynamically"""
    from portfolio.models import Project
    from shop.models import Product
    from datetime import datetime
    
    urls = [
        {'loc': '/', 'priority': '1.0', 'changefreq': 'weekly'},
        {'loc': '/portfolio', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': '/shop', 'priority': '0.9', 'changefreq': 'daily'},
        {'loc': '/about', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': '/contact', 'priority': '0.8', 'changefreq': 'monthly'},
    ]
    
    # Add portfolio projects
    for project in Project.objects.filter(featured=True):
        urls.append({
            'loc': f'/portfolio/{project.slug}',
            'priority': '0.7',
            'changefreq': 'monthly',
            'lastmod': project.updated_at.strftime('%Y-%m-%d')
        })
    
    # Add shop products
    for product in Product.objects.all():
        urls.append({
            'loc': f'/shop/{product.slug}',
            'priority': '0.7',
            'changefreq': 'weekly',
            'lastmod': product.updated_at.strftime('%Y-%m-%d')
        })
    
    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for url in urls:
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>https://kodeenhunter.com{url["loc"]}</loc>')
        if 'lastmod' in url:
            xml_lines.append(f'    <lastmod>{url["lastmod"]}</lastmod>')
        xml_lines.append(f'    <changefreq>{url["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{url["priority"]}</priority>')
        xml_lines.append('  </url>')
    
    xml_lines.append('</urlset>')
    
    return HttpResponse('\n'.join(xml_lines), content_type='application/xml')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/shop/', include('shop.urls')),
    path('api/booking/', include('booking.urls')),
    path('api/newsletter/', include('subscribers.urls')),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap_xml),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch-all for React frontend (must be last)
urlpatterns += [
    path('', TemplateView.as_view(template_name='index.html')),
]
