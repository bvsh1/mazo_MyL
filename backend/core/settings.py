from pathlib import Path

# Construye las rutas del proyecto relativas a este directorio base
BASE_DIR = Path(__file__).resolve().parent.parent

# ¡ADVERTENCIA: Mantén esta llave secreta segura en producción!
SECRET_KEY = 'django-insecure-tu-llave-secreta-aqui-cambiala-luego'

# Ponemos DEBUG en True para el MVP local
DEBUG = True

ALLOWED_HOSTS = ['*']

# Aplicaciones instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Librerías externas
    'rest_framework',
    'corsheaders',
    
    # Tu app
    'api_cartas',
]

# Middlewares
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Debe ir arriba
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Enrutador principal
ROOT_URLCONF = 'core.urls'

# --- LA SOLUCIÓN A TU ERROR ESTÁ AQUÍ ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [], # Si tuvieras una carpeta de templates global, iría aquí
        'APP_DIRS': True, # Esto le dice a Django que busque en las apps (necesario para el admin)
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Base de datos (SQLite por defecto, perfecta para este MVP local)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internacionalización
LANGUAGE_CODE = 'es-cl' # Adaptado para Chile
TIME_ZONE = 'America/Santiago'
USE_I18N = True
USE_TZ = True

# Archivos estáticos (CSS, JavaScript, Imágenes para el admin)
STATIC_URL = 'static/'

# Tipo de campo por defecto para IDs (Requerido en versiones nuevas de Django)
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración CORS para que Vite pueda conectarse
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50
}
