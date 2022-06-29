from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('search/', include('search.urls')),
    path('search2/', include('search2.urls')),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
#    path('accounts/', include('django.contrib.auth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
