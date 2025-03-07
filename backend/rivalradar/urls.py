from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_auth.urls')),
    path('api/auth/registration/', include('rest_auth.registration.urls')),
    path('api/competitors/', include('competitors.urls')),
    path('api/analysis/', include('analysis.urls')),
    path('api/users/', include('users.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 