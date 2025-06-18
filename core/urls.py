from django.urls import path, include
from rest_framework.routers import DefaultRouter
from knox import views as knox_views
from . import views

router = DefaultRouter()
router.register(r'villages', views.VillageViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'outages', views.PowerOutageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('auth/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
] 