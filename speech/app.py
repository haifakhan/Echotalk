# app.py — Flask service wrapping DeepSpeech

from flask import Flask, request
import deepspeech
import wave
import numpy as np
import io

app = Flask(__name__)

# here we are loading DeepSpeech model one time
model = deepspeech.Model('deepspeech.tflite')
model.enableExternalScorer('scorer.scorer')

@app.route('/process', methods=['POST'])
def process_audio():
    data = request.data
    audio_stream = io.BytesIO(data)

    with wave.open(audio_stream, 'rb') as wav_file:
        raw = wav_file.readframes(wav_file.getnframes())
        audio = np.frombuffer(raw, dtype=np.int16)
        result = model.stt(audio)
        return result

if __name__ == '__main__':
    app.run(port=5000)
