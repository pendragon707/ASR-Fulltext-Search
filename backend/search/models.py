from django.db import models
from django import forms

from django.contrib.auth.models import User

class File(models.Model):
#    file_id = models.IntegerField(primary_key=True)
    file_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=256)
    transcription = models.TextField()
#    transcription_phonetic = models.TextField(default='', blank=True)
    being_transcribed = models.BooleanField(default=False)
    highlight = models.TextField(default='')

#    created_datetime = models.DateTimeField(auto_now_add=True)
#    updated_datetime = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(User, related_name='files', on_delete=models.CASCADE)
    media = models.FileField(upload_to="storage", null=True, blank=True)

class FileUpload(forms.Form):
    file_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=256)
    transcription = models.TextField()
    being_transcribed = models.BooleanField(default=False)
    media = models.FileField(upload_to="storage", null=True, blank=True)
