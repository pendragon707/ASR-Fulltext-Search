from django.urls import path, include
from rest_framework import routers

from search.views import FileViewSet

router = routers.DefaultRouter()
router.register(r'file', FileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
