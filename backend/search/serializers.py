from rest_framework import serializers

from search.models import File, FileUpload
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'files']

class FileSerializer(serializers.ModelSerializer):
#    file_id = serializers.IntegerField(read_only=True)
    file_id = serializers.IntegerField(required=False)
    title = serializers.CharField()
    transcription = serializers.CharField(allow_blank=True, required=False)
    being_transcribed = serializers.BooleanField(default=False, required=False)
    owner = serializers.ReadOnlyField(source='owner.username')
    highlight = serializers.CharField(allow_blank=True, required=False)
#    media = serializers.FileField()
#    media_url = serializers.SerializerMethodField()

    class Meta:
        model = File
#        fields = '__all__'
#        fields = ['file_id', 'title', 'transcription', 'being_transcribed', 'owner']
        fields = ['file_id', 'title', 'transcription', 'being_transcribed', 'owner', 'highlight']

    def get_media_url(self, my_file):
        request = self.context.get('request')
        media_url = my_file.media.url
        return request.build_absolute_uri(media_url)

class LoginRequestSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['username', 'password']
