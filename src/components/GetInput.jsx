import React, { useState } from "react";

const GetInput = ({ setPrompt }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscription(text);
      setPrompt(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Input</h1>
      <button
        onClick={startListening}
        disabled={isListening}
        className={`px-4 py-2 text-white font-semibold rounded ${isListening ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {isListening ? "Listening..." : "Start Listening"}
      </button>
      <p className="mt-4 text-gray-700">
        {transcription ? `You said: "${transcription}"` : "No input yet."}
      </p>
    </div>
  );
};

export default GetInput;
