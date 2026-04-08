import os
from django.core.wsgi import get_wsgi_application

# Apunta a la configuración de tu carpeta core
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()