from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompetitorViewSet

router = DefaultRouter()
router.register(r'competitors', CompetitorViewSet, basename='competitor')

urlpatterns = [
    path('', include(router.urls)),
] 