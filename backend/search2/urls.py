from django.urls import path

from search2.views import SearchFiles

urlpatterns = [
    path('file/<str:query>/', SearchFiles.as_view()),
]

