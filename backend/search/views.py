from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes

from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.models import User

from search.models import File, FileUpload
from search.serializers import FileSerializer, UserSerializer, LoginRequestSerializer

import os
import requests
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PATH_STORAGE = os.path.join(BASE_DIR, 'storage')

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return

# это надо бы убрать
class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def my_login(request):
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            print(authenticated_user.username)
            login(request._request, authenticated_user)
            return Response({'status': 'Success'}, status=200)
        else:
            return Response({'status': 'Invalid credentials'}, status=403)
    else:
        return Response({'status': serializer.errors}, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def my_logout(request):
    logout(request._request)
    return Response({'status': 'Success'})


@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [CsrfExemptSessionAuthentication]

    @csrf_exempt
#    @permission_classes([AllowAny])
#    @authentication_classes([])
    def create(self, request):
         if User.objects.filter(username=request.data['username']).exists():
             return Response({'status': 'Exist'}, status=400)
         serializer = UserSerializer(data=request.data)
         if serializer.is_valid():
             User.objects.create_user(username=request.data['username'],
                                      password=request.data['password'],
                                      is_superuser=True)
             # serializer.save()

# для создания личной директории каждому пользователю на ASR-сервере,
# но пока всё загружается в общую директорию storage
#
#            url = 'http://127.0.0.1:5000/add_user'
#            answer = requests.post(url, json={"username": request.data['username']})

#             path = os.path.join(PATH_STORAGE, request.data['username'])
#             os.mkdir(path)

             return Response({'status': 'Success'}, status=200)
         return Response({'status': 'Error'}, status=status.HTTP_400_BAD_REQUEST)

    @csrf_exempt
    @action(detail=False, methods=["GET"])
    def get_username(self, request):
        if request.user is not None:
            return Response(request.user.username)
        return Response('-')

# @csrf_exempt
@method_decorator(csrf_exempt, name='dispatch')
class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()
#    authentication_classes = [SessionAuthentication]
    authentication_classes = [CsrfExemptSessionAuthentication]
#    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def create(self, request):
        form = FileUpload(request.POST, request.FILES)
        if form.is_valid():
            ufile = request.FILES['uploadFile']
#            ufile = request.FILES.get('uploadFile', False)
            filename = os.path.splitext(ufile.name)[0]
#            ufile = request.FILES['file']


#            data = {'name': request.user.username}
#            req = json.dumps( data )

            url = 'http://127.0.0.1:5000/add_file'


            answer = requests.post(url, files={'file': ufile})
#            answer = requests.post(url, files={'file': ufile, 'name': request.user.username})


#            path_file = os.path.join(PATH_STORAGE, request.user.username, ufile.name)
            path_file = os.path.join(PATH_STORAGE, ufile.name)
            with open(path_file, 'wb+') as dest:
                for chunk in ufile.chunks():
                    dest.write(chunk)
#            return Response(status = status.HTTP_201_CREATED)
#        return Response(form.is_valid())

        data = {'title': filename, 'transcription': ''}
        serializer = FileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
#            serializer.save()
            return JSONResponse(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return JSONResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @csrf_exempt
    def destroy(self, request, pk):
#        user_queryset = File.objects.all()
        user_queryset = self.request.user.files.all()
        dfile = get_object_or_404(user_queryset, pk=pk)
        dfile.delete()

        url = 'http://127.0.0.1:5000/delete_file'

        request = {"filename": dfile.title + ".wav"}
        request = json.dumps( request )
        answer = requests.post(url, json=request, timeout=3)

#        answer = requests.post(url, data={'filename': dfile.title + ".wav"})

        try:
#            path_file = os.path.join(PATH_STORAGE, request.user.username, dfile.title + ".wav")
            path_file = os.path.join(PATH_STORAGE, dfile.title + ".wav")
            os.remove(path_file)
            print( 'ok' )
        except FileNotFoundError:
            print( 'not file' )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @csrf_exempt
    def get_queryset(self):
        return self.request.user.files.all()

    @csrf_exempt
    def retrieve(self, request, pk):
#        user_queryset = File.objects.all()
        user_queryset = self.request.user.files.all()
        rfile = get_object_or_404(user_queryset, pk=pk)
        serializer = FileSerializer(rfile)
        return Response(serializer.data)

    @csrf_exempt
    def partial_update(self, request, pk=None):
#        files = self.get_object(pk)
        user_queryset = self.request.user.files.all()
        pfile = get_object_or_404(user_queryset, pk=pk)
        serializer = FileSerializer(pfile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @csrf_exempt
    @action(detail=True, methods=['get', 'post'])
    def transcribe(self, request, pk):
        user_queryset = File.objects.all()
#        user_queryset = self.request.user.files.all()
        tfile = get_object_or_404(user_queryset, pk=pk)

        serializer = FileSerializer(tfile, data={'being_transcribed': True}, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response({'Status': 'Error'}, status=400)

        url = 'http://127.0.0.1:5000/scribe'
#        request = {"id": tfile.file_id, "name": request.user.username, "filename": tfile.title + ".wav"}
        request = {"id": tfile.file_id, "name": request.data.get("name"), "filename": tfile.title + ".wav"}
        request = json.dumps( request )
        answer = requests.post(url, json=request, timeout=3)
        print( answer )

        return Response({'Status': 'Success'}, status=200)

    @csrf_exempt
    @action(detail=True, methods=['get'])
    def are_you_scribed(self, request, pk):
        user_queryset = self.request.user.files.all()
        pfile = get_object_or_404(user_queryset, pk=pk)

        if pfile.being_transcribed == False:
            return Response({'Status': 'Success', 'transcription': pfile.transcription}, status=200)
        return Response({'Status': 'Error', 'transcription': ''}, status=status.HTTP_400_BAD_REQUEST)

    @csrf_exempt
    @action(detail=False, methods=['get'])
    def get_last_file(self, request):
        last_file = self.request.user.files.last()
        serializer = FileSerializer(last_file)
        return Response(serializer.data)


# view для patch на обновление БД без регистрации и смс (для ASR-сервера)
# class FilePartialUpdateView(GenericAPIView, UpdateModelMixin):
class FilePartialUpdateView(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]

#    def put(self, request, *args, **kwargs):
#        return self.partial_update(request, *args, **kwargs)
