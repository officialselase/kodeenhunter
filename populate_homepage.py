#!/usr/bin/env python
"""
Populate homepage data: Services, Testimonials, and Awards
Run: python populate_homepage.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from portfolio.models import Service, Testimonial, Award, Project


def populate_services():
    """Create services offered"""
    services_data = [
        {
            'name': 'Videography',
            'slug': 'videography',
            'icon': 'Video',
            'short_description': 'Professional video production from concept to final cut, capturing your story with cinematic quality.',
            'description': 'Full-service video production including pre-production planning, on-location shooting, and post-production editing. Specializing in music videos, commercials, and branded content.',
            'featured': True,
            'order': 1
        },
        {
            'name': 'Cinematography',
            'slug': 'cinematography',
            'icon': 'Camera',
            'short_description': 'Expert camera work and lighting to create stunning visual narratives that captivate audiences.',
            'description': 'Professional cinematography services with high-end camera equipment and lighting setups. Creating beautiful, cinematic imagery for films, commercials, and music videos.',
            'featured': True,
            'order': 2
        },
        {
            'name': 'Color Grading',
            'slug': 'color-grading',
            'icon': 'Palette',
            'short_description': 'Transform your footage with professional color correction and grading for a polished, cinematic look.',
            'description': 'Advanced color grading services using DaVinci Resolve. Creating custom looks and ensuring color consistency across your entire project.',
            'featured': True,
            'order': 3
        },
        {
            'name': 'Music Videos',
            'slug': 'music-videos',
            'icon': 'Music',
            'short_description': 'Creative music video production that brings your sound to life with compelling visuals.',
            'description': 'Concept development, storyboarding, and production of music videos that capture the essence of your music and connect with your audience.',
            'featured': True,
            'order': 4
        },
        {
            'name': 'Commercial Production',
            'slug': 'commercial-production',
            'icon': 'Film',
            'short_description': 'High-impact commercial videos that showcase your brand and drive results.',
            'description': 'Full commercial production services from concept to delivery. Creating engaging content that tells your brand story and converts viewers into customers.',
            'featured': True,
            'order': 5
        },
        {
            'name': 'Drone Cinematography',
            'slug': 'drone-cinematography',
            'icon': 'Plane',
            'short_description': 'Breathtaking aerial footage that adds a unique perspective to your project.',
            'description': 'Licensed drone pilot providing stunning aerial cinematography. Perfect for real estate, events, commercials, and establishing shots.',
            'featured': True,
            'order': 6
        },
    ]
    
    print("Creating services...")
    for service_data in services_data:
        service, created = Service.objects.update_or_create(
            slug=service_data['slug'],
            defaults=service_data
        )
        print(f"  {'Created' if created else 'Updated'}: {service.name}")
    
    print(f"✓ Services complete: {Service.objects.count()} total")


def populate_testimonials():
    """Create client testimonials"""
    testimonials_data = [
        {
            'client_name': 'Sarah Mitchell',
            'client_title': 'Marketing Director',
            'client_company': 'Pulse Records',
            'client_photo_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
            'testimonial': 'Working with Kodeen was an absolute game-changer for our music video. His creative vision and technical expertise brought our artist\'s story to life in ways we never imagined. The final product exceeded all expectations.',
            'rating': 5,
            'featured': True,
            'order': 1
        },
        {
            'client_name': 'Marcus Chen',
            'client_title': 'CEO',
            'client_company': 'TechFlow Solutions',
            'client_photo_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            'testimonial': 'Kodeen delivered a commercial that perfectly captured our brand essence. His professionalism, attention to detail, and ability to work within our timeline made the entire process seamless. Highly recommend!',
            'rating': 5,
            'featured': True,
            'order': 2
        },
        {
            'client_name': 'Elena Rodriguez',
            'client_title': 'Independent Artist',
            'client_company': '',
            'client_photo_url': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
            'testimonial': 'As an independent artist, I needed someone who understood my vision and could work within my budget. Kodeen was incredible - creative, flexible, and the video quality was absolutely stunning. Can\'t wait to work together again!',
            'rating': 5,
            'featured': True,
            'order': 3
        },
        {
            'client_name': 'David Thompson',
            'client_title': 'Creative Director',
            'client_company': 'Momentum Agency',
            'client_photo_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
            'testimonial': 'We\'ve worked with many videographers, but Kodeen stands out. His cinematic approach and storytelling ability transformed our client\'s brand video into something truly special. The results speak for themselves.',
            'rating': 5,
            'featured': True,
            'order': 4
        },
        {
            'client_name': 'Jasmine Lee',
            'client_title': 'Event Coordinator',
            'client_company': 'Luxe Events',
            'client_photo_url': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
            'testimonial': 'Kodeen captured our luxury event beautifully. The drone footage was breathtaking, and his ability to capture candid moments while staying unobtrusive was impressive. Our clients loved the final video!',
            'rating': 5,
            'featured': True,
            'order': 5
        },
        {
            'client_name': 'Ryan Foster',
            'client_title': 'Producer',
            'client_company': 'Soundwave Studios',
            'client_photo_url': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
            'testimonial': 'The color grading work Kodeen did on our music video was phenomenal. He understood the mood we were going for and delivered a look that elevated the entire project. True professional and artist.',
            'rating': 5,
            'featured': True,
            'order': 6
        },
    ]
    
    print("\nCreating testimonials...")
    for testimonial_data in testimonials_data:
        # Create without project for now
        testimonial, created = Testimonial.objects.update_or_create(
            client_name=testimonial_data['client_name'],
            client_company=testimonial_data['client_company'],
            defaults=testimonial_data
        )
        print(f"  {'Created' if created else 'Updated'}: {testimonial.client_name}")
    
    print(f"✓ Testimonials complete: {Testimonial.objects.count()} total")


def populate_awards():
    """Create awards and recognition"""
    awards_data = [
        {
            'title': 'Best Music Video',
            'organization': 'Independent Film Awards',
            'year': 2024,
            'category': 'Music Video',
            'description': 'Awarded for outstanding cinematography and creative direction in music video production.',
            'featured': True,
            'order': 1
        },
        {
            'title': 'Excellence in Cinematography',
            'organization': 'Videography Guild',
            'year': 2024,
            'category': 'Cinematography',
            'description': 'Recognition for exceptional camera work and visual storytelling.',
            'featured': True,
            'order': 2
        },
        {
            'title': 'Best Commercial',
            'organization': 'Creative Media Awards',
            'year': 2023,
            'category': 'Commercial',
            'description': 'Honored for creating impactful commercial content that drives results.',
            'featured': True,
            'order': 3
        },
        {
            'title': 'Rising Star Award',
            'organization': 'National Videographers Association',
            'year': 2023,
            'category': 'Achievement',
            'description': 'Recognized as an emerging talent in the videography industry.',
            'featured': True,
            'order': 4
        },
        {
            'title': 'Best Color Grading',
            'organization': 'Post-Production Excellence Awards',
            'year': 2023,
            'category': 'Post-Production',
            'description': 'Awarded for exceptional color grading and visual enhancement work.',
            'featured': True,
            'order': 5
        },
        {
            'title': 'Audience Choice Award',
            'organization': 'Film Festival Circuit',
            'year': 2022,
            'category': 'Short Film',
            'description': 'Selected by audiences as the most impactful short film of the year.',
            'featured': True,
            'order': 6
        },
    ]
    
    print("\nCreating awards...")
    for award_data in awards_data:
        award, created = Award.objects.update_or_create(
            title=award_data['title'],
            year=award_data['year'],
            defaults=award_data
        )
        print(f"  {'Created' if created else 'Updated'}: {award.title} ({award.year})")
    
    print(f"✓ Awards complete: {Award.objects.count()} total")


def main():
    print("=" * 60)
    print("POPULATING HOMEPAGE DATA")
    print("=" * 60)
    
    populate_services()
    populate_testimonials()
    populate_awards()
    
    print("\n" + "=" * 60)
    print("✓ HOMEPAGE DATA POPULATION COMPLETE!")
    print("=" * 60)
    print("\nSummary:")
    print(f"  Services: {Service.objects.count()}")
    print(f"  Testimonials: {Testimonial.objects.count()}")
    print(f"  Awards: {Award.objects.count()}")
    print("\nYou can now view this data in:")
    print("  - Django Admin: http://localhost:8000/admin/")
    print("  - API Endpoints:")
    print("    - http://localhost:8000/api/portfolio/services/")
    print("    - http://localhost:8000/api/portfolio/testimonials/featured/")
    print("    - http://localhost:8000/api/portfolio/awards/featured/")


if __name__ == '__main__':
    main()
