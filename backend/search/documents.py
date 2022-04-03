from django_elasticsearch_dsl import Document, fields
from elasticsearch_dsl import analyzer, tokenizer
from django_elasticsearch_dsl.registries import registry

from search.models import File

# фонетический анализатор работает, но тогда не возвращаются highlight
# так что пока transcription без него
phonetic_analyzer = analyzer('phonetic_analyzer',
    tokenizer="standard",
    filter=["russian_phonetic"],
)

@registry.register_document
class FileDocument(Document):
    owner = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
    })

#    transcription = fields.TextField(analyzer=phonetic_analyzer)

    class Index:
        name = 'files'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }

    class Django:
        model = File
        fields = [
            'file_id',
            'title',
            'transcription',  # так будет с highlight
            'being_transcribed',
        ]
