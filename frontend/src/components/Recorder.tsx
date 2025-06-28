import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');
socket.on('connect', () => console.log('🔌 Socket connected!', socket.id));
socket.on('disconnect', () => console.log('❌ Socket disconnected'));

export default function Recorder() {
  // 1️⃣ Add state for partial & final transcripts
  const [partialTranscript, setPartialTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript]     = useState<string>('');

  useEffect(() => {
    // 2️⃣ Set up Socket.IO listeners
    socket.on('partial_transcript', (text: string) => {
      setPartialTranscript(text);
    });
    socket.on('final_transcript', (text: string) => {
      setFinalTranscript(prev => (prev ? prev + ' ' : '') + text);
    });

    // 3️⃣ Cleanup listeners on unmount
    return () => {
      socket.off('partial_transcript');
      socket.off('final_transcript');
    };
  }, []);

  useEffect(() => {
    // 4️⃣ Your existing mic + PCM streaming logic
    async function setupMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const pcmData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          int16[i] = Math.max(-1, Math.min(1, pcmData[i])) * 0x7fff;
        }
        console.log('▶️ Sending audio chunk of', int16.length, 'samples');
        socket.emit('audio_chunk', int16.buffer);
      };
    }

    setupMic();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">🎤 Recording…</h2>
      <div className="mt-4 space-y-2">
        {/* 5️⃣ Display partial and final transcripts */}
        <p className="text-gray-500 italic">{partialTranscript}</p>
        <p className="text-black">{finalTranscript}</p>
      </div>
    </div>
  );
}
