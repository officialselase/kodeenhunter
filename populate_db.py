"""
Populate database with sample portfolio data
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from portfolio.models import Category, Project, ProjectImage, Credit, Equipment, ProjectEquipment

# Clear existing data
print("Clearing existing data...")
Project.objects.all().delete()
Category.objects.all().delete()
Equipment.objects.all().delete()

# Create categories
print("Creating categories...")
music_videos = Category.objects.create(name='Music Videos', slug='music-videos', order=1)
commercials = Category.objects.create(name='Commercials', slug='commercials', order=2)
short_films = Category.objects.create(name='Short Films', slug='short-films', order=3)
events = Category.objects.create(name='Events', slug='events', order=4)

# Create equipment
print("Creating equipment...")
camera1 = Equipment.objects.create(name='Sony A7S III', category='Camera')
camera2 = Equipment.objects.create(name='Canon EOS R5', category='Camera')
lens1 = Equipment.objects.create(name='Sony FE 24-70mm f/2.8 GM', category='Lens')
lens2 = Equipment.objects.create(name='Canon RF 50mm f/1.2L', category='Lens')
gimbal = Equipment.objects.create(name='DJI Ronin RS3', category='Stabilization')
drone = Equipment.objects.create(name='DJI Mavic 3 Pro', category='Drone')

# Create projects
print("Creating projects...")

# Project 1: Midnight Echoes
project1 = Project.objects.create(
    title='Midnight Echoes',
    slug='midnight-echoes',
    category=music_videos,
    client='Echo Records',
    year=2024,
    duration='3:45',
    description='A cinematic music video exploring themes of solitude and self-discovery through stunning night cinematography. Shot entirely during the golden hour and blue hour, this project showcases the beauty of urban landscapes after dark.',
    thumbnail_url='https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=True,
    order=1
)
Credit.objects.create(project=project1, role='Director', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project1, role='Cinematographer', name='Kodeen Hunter', order=2)
Credit.objects.create(project=project1, role='Editor', name='Sarah Johnson', order=3)
Credit.objects.create(project=project1, role='Colorist', name='Michael Chen', order=4)
ProjectEquipment.objects.create(project=project1, equipment=camera1)
ProjectEquipment.objects.create(project=project1, equipment=lens1)
ProjectEquipment.objects.create(project=project1, equipment=gimbal)

# Project 2: Urban Pulse
project2 = Project.objects.create(
    title='Urban Pulse',
    slug='urban-pulse',
    category=commercials,
    client='Nike',
    year=2024,
    duration='1:30',
    description='High-energy commercial showcasing the latest athletic wear collection. Fast-paced editing combined with dynamic camera movements capture the essence of urban athleticism and street culture.',
    thumbnail_url='https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=True,
    order=2
)
Credit.objects.create(project=project2, role='Director', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project2, role='Producer', name='Lisa Martinez', order=2)
Credit.objects.create(project=project2, role='Gaffer', name='Tom Wilson', order=3)
ProjectEquipment.objects.create(project=project2, equipment=camera2)
ProjectEquipment.objects.create(project=project2, equipment=lens2)
ProjectEquipment.objects.create(project=project2, equipment=gimbal)

# Project 3: Beyond the Frame
project3 = Project.objects.create(
    title='Beyond the Frame',
    slug='beyond-the-frame',
    category=short_films,
    client='Independent',
    year=2023,
    duration='12:30',
    description='An experimental short film that blurs the line between reality and imagination. This passion project explores the creative process through visual metaphors and stunning cinematography.',
    thumbnail_url='https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=True,
    order=3
)
Credit.objects.create(project=project3, role='Director', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project3, role='Writer', name='Kodeen Hunter', order=2)
Credit.objects.create(project=project3, role='Sound Design', name='Alex Rivera', order=3)
ProjectEquipment.objects.create(project=project3, equipment=camera1)
ProjectEquipment.objects.create(project=project3, equipment=lens1)
ProjectEquipment.objects.create(project=project3, equipment=drone)

# Project 4: Neon Dreams
project4 = Project.objects.create(
    title='Neon Dreams',
    slug='neon-dreams',
    category=music_videos,
    client='Synthwave Records',
    year=2023,
    duration='4:12',
    description='A retro-futuristic music video featuring vibrant neon aesthetics and smooth camera movements. Inspired by 80s cyberpunk culture and modern electronic music.',
    thumbnail_url='https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=False,
    order=4
)
Credit.objects.create(project=project4, role='Director', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project4, role='VFX Artist', name='Emma Davis', order=2)
ProjectEquipment.objects.create(project=project4, equipment=camera2)
ProjectEquipment.objects.create(project=project4, equipment=lens2)

# Project 5: The Journey
project5 = Project.objects.create(
    title='The Journey',
    slug='the-journey',
    category=commercials,
    client='Toyota',
    year=2023,
    duration='2:00',
    description='Automotive commercial highlighting adventure and exploration. Stunning landscape cinematography combined with intimate character moments.',
    thumbnail_url='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=False,
    order=5
)
Credit.objects.create(project=project5, role='Director', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project5, role='Drone Operator', name='Chris Anderson', order=2)
ProjectEquipment.objects.create(project=project5, equipment=camera1)
ProjectEquipment.objects.create(project=project5, equipment=drone)

# Project 6: Summer Festival
project6 = Project.objects.create(
    title='Summer Festival',
    slug='summer-festival',
    category=events,
    client='Coachella',
    year=2023,
    duration='5:30',
    description='Event coverage capturing the energy and excitement of a major music festival. Multi-camera setup with dynamic editing.',
    thumbnail_url='https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    video_url='https://www.youtube.com/embed/dQw4w9WgXcQ',
    featured=False,
    order=6
)
Credit.objects.create(project=project6, role='Lead Videographer', name='Kodeen Hunter', order=1)
Credit.objects.create(project=project6, role='Camera Operator', name='Jake Thompson', order=2)
ProjectEquipment.objects.create(project=project6, equipment=camera1)
ProjectEquipment.objects.create(project=project6, equipment=camera2)
ProjectEquipment.objects.create(project=project6, equipment=gimbal)

print("\n✅ Database populated successfully!")
print(f"Created {Category.objects.count()} categories")
print(f"Created {Project.objects.count()} projects")
print(f"Created {Equipment.objects.count()} equipment items")
print(f"Created {Credit.objects.count()} credits")
