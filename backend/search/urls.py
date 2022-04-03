from django.urls import path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from django.views.decorators.csrf import csrf_exempt

from search.views import FileViewSet, UserViewSet, my_login, my_logout, FilePartialUpdateView
# FileList, FileDetail
# from search.views import FileItemViews

router = routers.DefaultRouter()
router.register(r'file', FileViewSet)
router.register(r'user', UserViewSet)

router.register(r'pfile', FilePartialUpdateView)

urlpatterns = [
    path('', include(router.urls)),
    path('login', my_login, name='login'),
    path('logout', my_logout, name='logout'),
#    path('pfile/<int:pk>/', csrf_exempt(FilePartialUpdateView.as_view()), name='file_partial_update'),



#    path(r'^pfile/(?P<pk>[^/.]+)/$', FilePartialUpdateView.as_view(), name='file_partial_update'),
#    url(r'^pfile/(?P<pk>\d+)/$', FilePartialUpdateView.as_view(), name='file_partial_update'),
#    url(r'^myview/$', csrf_exempt(views.MyView.as_view()), name='myview'),
#    path('file/', FileList.as_view()),
#    path('file/<int:pk>/', FileDetail.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)
