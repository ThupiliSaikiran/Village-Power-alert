from django.urls import path, include
from rest_framework.routers import DefaultRouter
from knox import views as knox_views
from . import views
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Village Power Alert System API',
        'endpoints': {
            'villages': '/api/villages/',
            'users': '/api/users/',
            'outages': '/api/outages/',
            'auth': {
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/'
            }
        }
    })

router = DefaultRouter()
router.register(r'villages', views.VillageViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'outages', views.PowerOutageViewSet)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('auth/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
] 