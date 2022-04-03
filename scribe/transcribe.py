#!/usr/bin/env python
import os
import sys
import json
import signal
import requests
from vosk import Model, KaldiRecognizer

from concurrent import futures
from pydub import AudioSegment
from flask import Flask, request, jsonify
# , make_response

from flask_cors import CORS, cross_origin


os.environ["SCRIBE_STORAGE"] = "./storage/"
SCRIBE_STORAGE = os.environ["SCRIBE_STORAGE"] if "SCRIBE_STORAGE" in os.environ else "."
os.environ["CALLBACK_URL"] = "http://127.0.0.1:8000/search/pfile/"
CALLBACK_URL = os.environ["CALLBACK_URL"] if "CALLBACK_URL" in os.environ else "http://localhost:3000"

rec = KaldiRecognizer(Model("./model"), 16000)
rec.SetWords(False)

def transcribe(id, name, filename):
  try:
    print(f"==> Transcribing {filename}")
    print(name)
#    storage = SCRIBE_STORAGE + name + "/"
#    wav = AudioSegment.from_wav(os.path.join(storage, filename)) \
    wav = AudioSegment.from_wav(os.path.join(SCRIBE_STORAGE, filename)) \
      .set_channels(1) \
      .set_frame_rate(16000) \
      .export(format="wav") \
      .read()

    rec.AcceptWaveform(wav)

    print(f"<== Transcribing {filename}")
    return {
      "id": id,
      "result": json.loads(rec.Result())["text"],
    }
  except Exception as e:
    print(f"Transcribe error: {e}", file=sys.stderr)
    return {
      "id": id,
      "result": None,
    }

executor = futures.ThreadPoolExecutor(max_workers=1)
queue = { }

# @cross_origin(supports_credentials=True)
def transcribe_callback(task):
  with app.app_context():
    try:
      result = task.result()
    except futures._base.CancelledError:
      return

    if result["id"] in queue:
      try:
        nurl = str(CALLBACK_URL+str(result["id"])+'/')
        answer = {'being_transcribed': False, 'transcription': result["result"]}
        hey = requests.patch(nurl, data=answer, timeout=3)

#        requests.put(nurl, data=answer, timeout=3)

      except Exception:
        # Why are we still here?
        # Just to suffer?
        print('you are penguin')
      del queue[result["id"]]

def stop_signal(x, y):
  executor.shutdown(wait=False, cancel_futures=True)

signal.signal(signal.SIGTERM, stop_signal)
signal.signal(signal.SIGINT, stop_signal)

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# @app.after_request
# def creds(response):
#     response.headers['Access-Control-Allow-Credentials'] = 'true'
#     return response

@app.route("/scribe", methods = ["GET", "POST"])
# @cross_origin(supports_credentials=True)
def scribe():
  with app.app_context():
    if not request.get_json() or not "filename" in json.loads( request.json ):
      return jsonify({"status":"Bad request"}), 400
    req = json.loads( request.get_json() )
    filename = req["filename"]

    if not "name" in req:
      return jsonify({"status":"Bad request"}), 400
    name = req["name"]

    try:
      id = req["id"]


#    if not request.get_json() or not "filename" in request.json:
#      return jsonify({"status":"Bad request"}), 400
#    filename = request.get_json()["filename"]
#
#    if not request.get_json() or not "name" in request.json:
#      return jsonify({"status":"Bad request"}), 400
#    name = request.get_json()["name"]
#
#    try:
#      id = request.get_json()["id"]


    except ValueError:
      return "Bad request", 400

    if id in queue:
      return "Ok", 200

    task = executor.submit(transcribe, id, name, filename)
    task.add_done_callback(transcribe_callback)
    queue.update({ id: task })

#    print( task.result()["result"] )

#    message = {'file_id': id, 'title': filename, 'transcription': task.result()["result"]}

#    return jsonify(message)
    return jsonify({"status":"Ok"}), 200

@app.route("/cancel", methods = ["POST"])
# @cross_origin(supports_credentials=True)
def cancel():
  with app.app_context():
    id = request.get_json()["id"]
    if id is None:
      return jsonify({"status":"Bad request, cancel"}), 400

    task = queue.get(id)
    if task is not None:
      task.cancel()
      del queue[id]

    return jsonify({"status":"Ok, cancel"}), 200

# пока не используется
@app.route("/add_user", methods = ["POST"])
def add_user():
  with app.app_context():
    if not request.get_json() or not "username" in json.loads( request.json ):
      return jsonify({"status":"Bad request"}), 400
    req = json.loads( request.get_json() )
    username = req["username"]

    path = os.path.join(SCRIBE_STORAGE, username)
    os.mkdir(path)

    return jsonify({"status":"Ok"}), 200


@app.route("/add_file", methods = ["POST"])
def add_file():
  with app.app_context():
    if request.method == 'POST':
      try:
        my_file = request.files['file']
        # для того, чтобы у каждого пользователя была своя директория - не
        # не доделано
 #       name = request.files['name']
 #       print(name)
      except:
        return jsonify({"status":"Bad request"}), 400
    else:
      return jsonify({"status":"Bad request"}), 400

    filename = my_file.filename
    storage = SCRIBE_STORAGE
#    storage = SCRIBE_STORAGE + name + "/"
    my_file.save(os.path.join(storage, filename))
    return jsonify({"status":"Ok"}), 200

@app.route("/delete_file", methods = ["POST"])
def delete_file():
  with app.app_context():
    if not request.get_json() or not "filename" in json.loads( request.json ):
      return jsonify({"status":"Bad request"}), 400
    req = json.loads( request.get_json() )
    filename = req["filename"]

    try:
        path_file = os.path.join(SCRIBE_STORAGE, filename)
        os.remove(path_file)
        print( 'ok' )
    except FileNotFoundError:
        print( 'not file' )
        return jsonify({"status":"Not Found"}), 200

    return jsonify({"status":"Ok"}), 200
