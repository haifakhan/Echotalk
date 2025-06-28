require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace this with your actual audio file path (WAV or MP3 works)
const AUDIO_FILE_PATH = path.resolve(__dirname, 'test_fixed_20s.wav');

(async () => {
  try {
    const audioData = fs.readFileSync(AUDIO_FILE_PATH);
    const { AZURE_SPEECH_KEY, AZURE_SPEECH_REGION } = process.env;

    const response = await axios.post(
      `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
      audioData,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': 'audio/wav',
          'Accept': 'application/json',
          'Transfer-Encoding': 'chunked',
        },
      }
    );

    console.log('Full response:', response.data);

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
})();
