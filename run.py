#!/usr/bin/env python
"""
Main entry point for running both Django backend and React frontend.
"""
import os
import subprocess
import sys
import signal
import time
from pathlib import Path

processes = []

def signal_handler(sig, frame):
    print("\nShutting down servers...")
    for p in processes:
        if p.poll() is None:
            p.terminate()
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    base_dir = Path(__file__).parent
    
    print("Running Django migrations...")
    subprocess.run([sys.executable, "manage.py", "migrate", "--run-syncdb"], check=True)
    
    print("Starting Django backend on port 8000...")
    django_process = subprocess.Popen([
        sys.executable, "manage.py", "runserver", "0.0.0.0:8000"
    ])
    processes.append(django_process)
    
    time.sleep(2)
    
    print("Starting React frontend on port 5000...")
    frontend_dir = base_dir / "frontend"
    react_process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", "5000"],
        cwd=frontend_dir
    )
    processes.append(react_process)
    
    print("\n" + "="*50)
    print("Servers running:")
    print("  - Frontend: http://0.0.0.0:5000")
    print("  - Backend API: http://0.0.0.0:8000/api/")
    print("  - Admin: http://0.0.0.0:8000/admin/")
    print("="*50 + "\n")
    
    for p in processes:
        p.wait()

if __name__ == "__main__":
    main()
