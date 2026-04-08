from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Todas las rutas de cartas quedarán bajo /api/cartas/
    path('api/', include('api_cartas.urls')), 
]