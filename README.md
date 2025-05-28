# EchoTalk

**EchoTalk** is a real-time speech-to-text web application designed to support individuals with speech disorders by helping them communicate more clearly during online meetings (like Zoom, Discord, or Teams).

This app is currently **in progress** and actively being developed.

---

## 💡 What EchoTalk Will Do

- 🎙️ Capture live microphone input from users
- 🔁 Stream audio in real time to the backend using WebSockets
- 🧠 Transcribe speech using DeepSpeech (locally hosted Python service)
- 🪄 Improve transcript accuracy over time using personalized training
- ✨ Use AI to further clean up transcripts based on context
- 🧑‍💻 Display live transcripts to the user and optionally to others in a meeting
- 🧾 Save transcripts and training data in a PostgreSQL database

---

## ⚙️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, Socket.IO
- **Speech Engine:** DeepSpeech (Python)
- **Database:** PostgreSQL
- **AI Correction:** Cohere AI for contextual fixes in the transcript

---

## 🚧 Status

This app is currently in development.  
The main focus right now is setting up real-time audio streaming, integrating DeepSpeech, and building the user training flow.

Stay tuned!
