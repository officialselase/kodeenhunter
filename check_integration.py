#!/usr/bin/env python
"""
Backend-Frontend Integration Check
Verifies that all systems are working correctly
"""

import requests
import sys
from colorama import init, Fore, Style

init(autoreset=True)

BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5174"

def check_endpoint(name, url, expected_status=200):
    """Check if an endpoint is accessible"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == expected_status:
            print(f"{Fore.GREEN}✓{Style.RESET_ALL} {name}: OK (Status {response.status_code})")
            return True
        else:
            print(f"{Fore.RED}✗{Style.RESET_ALL} {name}: FAILED (Status {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}✗{Style.RESET_ALL} {name}: ERROR - {str(e)}")
        return False

def check_json_endpoint(name, url, expected_keys=None):
    """Check if a JSON endpoint returns valid data"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if expected_keys:
                if isinstance(data, list):
                    if len(data) > 0 and all(key in data[0] for key in expected_keys):
                        print(f"{Fore.GREEN}✓{Style.RESET_ALL} {name}: OK ({len(data)} items)")
                        return True
                elif all(key in data for key in expected_keys):
                    print(f"{Fore.GREEN}✓{Style.RESET_ALL} {name}: OK")
                    return True
            else:
                print(f"{Fore.GREEN}✓{Style.RESET_ALL} {name}: OK")
                return True
        print(f"{Fore.RED}✗{Style.RESET_ALL} {name}: FAILED")
        return False
    except Exception as e:
        print(f"{Fore.RED}✗{Style.RESET_ALL} {name}: ERROR - {str(e)}")
        return False

def main():
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"Backend-Frontend Integration Check")
    print(f"{'='*60}{Style.RESET_ALL}\n")
    
    results = []
    
    # Backend Checks
    print(f"{Fore.YELLOW}Backend Services:{Style.RESET_ALL}")
    results.append(check_endpoint("Admin Portal", f"{BACKEND_URL}/admin/"))
    results.append(check_endpoint("Robots.txt", f"{BACKEND_URL}/robots.txt"))
    results.append(check_endpoint("Sitemap.xml", f"{BACKEND_URL}/sitemap.xml"))
    
    print(f"\n{Fore.YELLOW}API Endpoints:{Style.RESET_ALL}")
    results.append(check_json_endpoint(
        "Featured Projects", 
        f"{BACKEND_URL}/api/portfolio/projects/featured/",
        ["id", "title", "slug"]
    ))
    results.append(check_json_endpoint(
        "Featured Products", 
        f"{BACKEND_URL}/api/shop/products/featured/",
        ["id", "name", "price"]
    ))
    results.append(check_json_endpoint(
        "Services", 
        f"{BACKEND_URL}/api/portfolio/services/"
    ))
    results.append(check_json_endpoint(
        "Testimonials", 
        f"{BACKEND_URL}/api/portfolio/testimonials/featured/"
    ))
    results.append(check_json_endpoint(
        "Awards", 
        f"{BACKEND_URL}/api/portfolio/awards/featured/"
    ))
    results.append(check_json_endpoint(
        "Booking Services", 
        f"{BACKEND_URL}/api/booking/services/"
    ))
    
    # Frontend Check
    print(f"\n{Fore.YELLOW}Frontend:{Style.RESET_ALL}")
    results.append(check_endpoint("Frontend Server", FRONTEND_URL))
    
    # Summary
    print(f"\n{Fore.CYAN}{'='*60}")
    passed = sum(results)
    total = len(results)
    percentage = (passed / total) * 100
    
    if percentage == 100:
        print(f"{Fore.GREEN}✓ All checks passed! ({passed}/{total}){Style.RESET_ALL}")
    elif percentage >= 80:
        print(f"{Fore.YELLOW}⚠ Most checks passed ({passed}/{total} - {percentage:.0f}%){Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}✗ Multiple failures ({passed}/{total} - {percentage:.0f}%){Style.RESET_ALL}")
    
    print(f"{'='*60}{Style.RESET_ALL}\n")
    
    # Admin Info
    print(f"{Fore.CYAN}Admin Portal Access:{Style.RESET_ALL}")
    print(f"  URL: {BACKEND_URL}/admin/")
    print(f"  Default credentials: admin / admin123")
    
    print(f"\n{Fore.CYAN}Cache Management:{Style.RESET_ALL}")
    print(f"  Clear cache: python manage.py shell -c \"from django.core.cache import cache; cache.clear()\"")
    print(f"  Cache timeout: 5 minutes (300 seconds)")
    
    return 0 if percentage == 100 else 1

if __name__ == "__main__":
    sys.exit(main())
