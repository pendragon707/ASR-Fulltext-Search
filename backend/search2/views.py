from django.shortcuts import render

import abc

from django.http import HttpResponse
from elasticsearch_dsl import Q, analyzer
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

# from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
#from django_elasticsearch_dsl_drf.filter_backends import (
#    # ...
#    HighlightBackend,
#)

from search.documents import FileDocument
from search.serializers import FileSerializer

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return


class PaginatedElasticSearchAPIView(APIView, LimitOffsetPagination):
    serializer_class = None
    document_class = None

    @abc.abstractmethod
    def generate_q_expression(self, query):
        pass

    def get(self, request, query):
        try:
            q = self.generate_q_expression(query)
            search = self.document_class.search() \
                    .query(q) \
                    .highlight('transcription', fragment_size=70)
            search.update_from_dict({"size": 100})
            response = search.execute()

            print(f'Found {response.hits.total.value} hit(s) for query: "{query}"')

            results = self.paginate_queryset(response, request, view=self)
#            serializer = self.serializer_class(results, many=True)
#            return self.get_paginated_response(serializer.data)

            data = []
            if response.hits.total.value > 100:
                response.hits.total.value = 100

            for i in range(response.hits.total.value):
                values = response.hits.hits[i]._source
                data.append({'file_id': values.file_id, 'title': values.title, 'transcription': values.transcription, \
                    'being_transcribed': values.being_transcribed, \
                    'highlight': response.hits.hits[i].highlight.transcription[0]})
#                    'highlight': ''})
            serializer = FileSerializer(data=data, many=True)
            if serializer.is_valid():
                return self.get_paginated_response(serializer.data)
            else:
                print( 'you are penguin')
                return HttpResponse(status=500)
        except Exception as e:
            return HttpResponse(e, status=500)


class SearchFiles(PaginatedElasticSearchAPIView):
    serializer_class = FileSerializer
    document_class = FileDocument

    authentication_classes = [CsrfExemptSessionAuthentication]
#    authentication_classes = [SessionAuthentication]
#    permission_classes = [IsAuthenticated]

    def generate_q_expression(self, query):
        return Q(
                'multi_match', query=query,
                fields=[
                #    'title',
                    'transcription'
#                    'transcription_phonetic'
                ], fuzziness='auto') \
                & Q('match', owner__username=self.request.user.username)
