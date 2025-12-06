#!/usr/bin/env python
"""Populate shop with sample products"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from shop.models import ProductCategory, Product, ProductFeature

print("Creating shop data...")

# Clear existing shop data
ProductFeature.objects.all().delete()
Product.objects.all().delete()
ProductCategory.objects.all().delete()

# Create categories
luts_cat = ProductCategory.objects.create(
    name="LUTs",
    slug="luts",
    order=1
)

presets_cat = ProductCategory.objects.create(
    name="Presets",
    slug="presets",
    order=2
)

templates_cat = ProductCategory.objects.create(
    name="Templates",
    slug="templates",
    order=3
)

merch_cat = ProductCategory.objects.create(
    name="Merchandise",
    slug="merchandise",
    order=4
)

# Create products
product1 = Product.objects.create(
    name="Cinematic LUT Pack",
    slug="cinematic-lut-pack",
    category=luts_cat,
    price="49.99",
    description="20 professional cinematic LUTs for film-like color grading. Transform your footage with Hollywood-grade color science.",
    short_description="20 professional cinematic LUTs",
    image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
    is_digital=True,
    featured=True,
    stock=999,
    is_active=True
)
ProductFeature.objects.create(product=product1, feature="20 Professional LUTs")
ProductFeature.objects.create(product=product1, feature="Compatible with all NLEs")
ProductFeature.objects.create(product=product1, feature="Before/After previews included")

product2 = Product.objects.create(
    name="Music Video Presets",
    slug="music-video-presets",
    category=presets_cat,
    price="39.99",
    description="Premiere Pro presets for stunning music video looks. One-click application with adjustable parameters.",
    short_description="Premiere Pro music video presets",
    image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    is_digital=True,
    featured=True,
    stock=999,
    is_active=True
)
ProductFeature.objects.create(product=product2, feature="15 Unique Presets")
ProductFeature.objects.create(product=product2, feature="One-click application")
ProductFeature.objects.create(product=product2, feature="Fully adjustable parameters")

product3 = Product.objects.create(
    name="Transition Pack Vol.1",
    slug="transition-pack-vol-1",
    category=templates_cat,
    price="29.99",
    description="Smooth, professional transitions for your edits. Includes sound effects and easy customization.",
    short_description="50+ professional transitions",
    image="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
    is_digital=True,
    featured=True,
    stock=999,
    is_active=True
)
ProductFeature.objects.create(product=product3, feature="50+ Smooth Transitions")
ProductFeature.objects.create(product=product3, feature="Easy to customize")
ProductFeature.objects.create(product=product3, feature="Sound effects included")

product4 = Product.objects.create(
    name="Kodeen Hunter Tee",
    slug="kodeen-hunter-tee",
    category=merch_cat,
    price="34.99",
    description="Premium cotton tee with embroidered logo. Comfortable fit for all-day wear.",
    short_description="Premium cotton tee",
    image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    is_digital=False,
    featured=False,
    stock=50,
    is_active=True
)
ProductFeature.objects.create(product=product4, feature="100% Premium Cotton")
ProductFeature.objects.create(product=product4, feature="Embroidered logo")
ProductFeature.objects.create(product=product4, feature="Multiple sizes available")

product5 = Product.objects.create(
    name="Film Grain Overlays",
    slug="film-grain-overlays",
    category=templates_cat,
    price="24.99",
    description="Authentic film grain textures for vintage looks. 4K resolution, loop-ready.",
    short_description="Authentic film grain textures",
    image="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
    is_digital=True,
    featured=False,
    stock=999,
    is_active=True
)
ProductFeature.objects.create(product=product5, feature="4K Resolution")
ProductFeature.objects.create(product=product5, feature="10 Unique Overlays")
ProductFeature.objects.create(product=product5, feature="Loop-ready")

product6 = Product.objects.create(
    name="Orange & Teal LUTs",
    slug="orange-teal-luts",
    category=luts_cat,
    price="34.99",
    description="The classic cinematic look made easy. 12 variations, LOG compatible, skin tone safe.",
    short_description="Classic cinematic color grading",
    image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    is_digital=True,
    featured=False,
    stock=999,
    is_active=True
)
ProductFeature.objects.create(product=product6, feature="12 Variations")
ProductFeature.objects.create(product=product6, feature="LOG compatible")
ProductFeature.objects.create(product=product6, feature="Skin tone safe")

print(f"\n✅ Shop populated successfully!")
print(f"Created {ProductCategory.objects.count()} categories")
print(f"Created {Product.objects.count()} products")
print(f"Created {ProductFeature.objects.count()} features")
