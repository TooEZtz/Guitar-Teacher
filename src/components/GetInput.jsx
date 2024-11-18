import React, { useState, useEffect } from "react";

const GetInput = ({ setPrompt, startListening }) => {
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    // Start listening only after pressing the space key
    const handleSpaceKey = (event) => {
      if (event.key === " ") {
        startListening(); // Start speech recognition when space key is pressed
      }
    };

    // Add event listener for space key press
    window.addEventListener("keydown", handleSpaceKey);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, [startListening]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Input</h1>
      
      {/* Display transcription */}
      <p className="mt-4 text-gray-700">
        {transcription ? `You said: "${transcription}"` : "Press space to start listening."}
      </p>
    </div>
  );
};

export default GetInput;
