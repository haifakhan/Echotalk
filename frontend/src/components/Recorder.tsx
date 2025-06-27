import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // backend running locally

export default function Recorder() {
  const audioRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    async function setupMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          socket.emit('audio_chunk', e.data); // send audio chunk to server
        }
      };

      mediaRecorder.start(250); // send chunk every 250ms
    }

    setupMic();
  }, []);

  return <div className="p-4">🎤 Recording...</div>;
}
