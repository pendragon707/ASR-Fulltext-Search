from django.db import models

class File(models.Model):
    title = models.CharField(max_length=256)
#    author = models.CharField(max_length=256)
    transcription = models.TextField()
#    created_datetime = models.DateTimeField(auto_now_add=True)
#    updated_datetime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title}'
