require('dotenv').config();
const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sdk = require('microsoft-cognitiveservices-speech-sdk');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const AZURE_KEY    = process.env.AZURE_SPEECH_KEY;
const AZURE_REGION = process.env.AZURE_SPEECH_REGION;

// Create shared SpeechConfig
const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION);
speechConfig.speechRecognitionLanguage = 'en-US';

// When a client connects:
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 1) Create a PushAudioInputStream for this session
  const pushStream = sdk.AudioInputStream.createPushStream();

  // 2) Create AudioConfig from the push stream
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

  // 3) Create a SpeechRecognizer
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // 4) Hook up partial (recognizing) events
  recognizer.recognizing = (s, e) => {
    socket.emit('partial_transcript', e.result.text);
  };

  // 5) Hook up final (recognized) events
  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      socket.emit('final_transcript', e.result.text);
    }
  };

  // 6) Start continuous recognition
  recognizer.startContinuousRecognitionAsync();

  // 7) On incoming audio chunks from client, push into Azure stream
  socket.on('audio_chunk', (chunk) => {
    // chunk should be an ArrayBuffer or Buffer of raw 16 kHz PCM s16le samples
    pushStream.write(Buffer.from(chunk));
  });

  // 8) When the client indicates end of stream (e.g. on "stop recording"):
  socket.on('end_stream', () => {
    pushStream.close();                        // signal end of audio
    recognizer.stopContinuousRecognitionAsync(
      () => console.log('Recognition stopped'),
      (err) => console.error('Stop error:', err)
    );
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    pushStream.close();
    recognizer.close();
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
