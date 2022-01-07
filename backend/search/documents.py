from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from search.models import File

@registry.register_document
class FileDocument(Document):
    class Index:
        name = 'files'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }

    class Django:
        model = File
        fields = [
            'title',
            'transcription',
        ]
