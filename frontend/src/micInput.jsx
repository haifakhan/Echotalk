// handles mic capture and streaming

import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function MicInput() {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      recorder.start(300); // capture audio every 300ms. need to match this with backend processing

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          e.data.arrayBuffer().then((buf) => {
            socket.emit("audio-data", new Uint8Array(buf));
          });
        }
      };

      socket.on("transcription", (text) => {
        console.log("Transcript:", text);
      });
    });
  }, []);

  return <div>Listening and transcribing...</div>;
}

export default MicInput;
