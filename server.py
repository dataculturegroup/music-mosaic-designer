import json
import os
from werkzeug.serving import run_simple
from pydub import AudioSegment
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

basedir = os.path.dirname(os.path.abspath(__file__))
SONG_PATH = os.path.join(basedir, 'data/songs/')


@app.route('/')
def home():
    files = [f for f in os.listdir(SONG_PATH) if os.path.isfile(os.path.join(SONG_PATH, f))]
    return render_template('index.html', files=files)


@app.route('/analyze', methods=['POST'])
def analyze():
    filename = request.form['song']
    slice_count = int(request.form['slices'])
    filepath = os.path.join(SONG_PATH, filename)
    results = analyze_wav_file(filepath, slice_count)
    return jsonify(results)


def analyze_wav_file(song_path, slice_count):
    song = AudioSegment.from_wav(song_path)
    slice_duration = song.duration_seconds / slice_count
    slices = []
    for index in range(slice_count):
        start_time = int(index*slice_duration*1000)
        end_time = int((index+1)*slice_duration*1000)
        sample = song[start_time:end_time]
        slice_data = {
            'index': index,
            'start_ms': start_time,
            'end_ms': end_time,
            'dBFS': sample.dBFS
        }
        slices.append(slice_data)
    # normalize for rendering
    amplitudes = [s['dBFS'] for s in slices]
    for s in slices:
        s['normalized_dBFS'] = (-1*min(amplitudes))+s['dBFS']
    return slices


if __name__ == '__main__':
    run_simple('localhost', 5000, app, use_reloader=True, use_debugger=True)
