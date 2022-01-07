from rest_framework import serializers

from search.models import File


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'first_name', 'last_name')

class FileSerializer(serializers.ModelSerializer):
#    author = UserSerializer()
#    categories = CategorySerializer(many=True)

    class Meta:
        model = File
        fields = '__all__'
