# docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.16.2

FROM docker.elastic.co/elasticsearch/elasticsearch:7.6.2
# RUN /usr/share/elasticsearch/bin/plugin install --batch analysis-phonetic

# RUN elasticsearch-plugin install analysis-phonetic
RUN elasticsearch-plugin install https://github.com/papahigh/elasticsearch-russian-phonetics/raw/7.6.2/esplugin/plugin-distributions/analysis-russian-phonetic-7.6.2.zip
