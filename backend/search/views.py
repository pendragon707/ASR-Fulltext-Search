from django.shortcuts import render

from rest_framework import viewsets

from search.models import File
from search.serializers import FileSerializer


# class UserViewSet(viewsets.ModelViewSet):
#     serializer_class = UserSerializer
#     queryset = User.objects.all()

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()
