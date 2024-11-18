import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GuitarTutor = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false); // To track if the app is active
  const [userChoice, setUserChoice] = useState(""); // To store chord or song choice
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const synth = window.speechSynthesis;

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback; // Callback after speech ends
    synth.speak(utterance);
  };

  useEffect(() => {
    // Start process when spacebar is pressed
    const handleKeyPress = (e) => {
      if (e.code === "Space" && !isActive) {
        setIsActive(true);
        greetUser();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isActive]);

  const greetUser = () => {
    console.log("Greeting user...");
    speak("Hi, how is it going? Would you like to learn some chords or a song today?", () => {
      startListening(); // Start listening after greeting ends
    });
  };

  const startListening = () => {
    console.log("Starting speech recognition...");
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Speech recognition started...");
      setIsListening(true);
    };
    
    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      console.log("Speech result received:", text); // Log the result
      setPrompt(text);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "User", text: text },
      ]);
      speak(`You said: ${text}`, () => {
        // Analyze the response and branch accordingly
        if (text.toLowerCase().includes("chord")) {
          setUserChoice("chord");
          chord();
        } else if (text.toLowerCase().includes("song")) {
          setUserChoice("song");
          song();
        } else {
          speak("Sorry, I didn't catch that. Please tell me if you want to learn a chord or a song.", () => {
            startListening(); // Restart listening if unclear
          });
        }
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setIsListening(false);
    };

    recognition.start();
  };

  const chord = () => {
    console.log("Entering chord function...");
    speak("Which chord would you like to learn?", () => {
      startListeningForChord(); // Start listening for the chord after speaking
    });
  };

  const startListeningForChord = () => {
    console.log("Starting listening for chord...");
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Listening for chord input...");
      setIsListening(true);
    };
    
    recognition.onresult = async (event) => {
      const chord = event.results[0][0].transcript;
      console.log("Chord input received:", chord);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "User", text: chord },
      ]);
      speak(`You said: ${chord}. Let me teach you how to play that chord.`, () => {
        generateResponse("chord", chord, () => {
          askToContinue(); // Continue asking if they want to learn more
        });
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Chord listening ended.");
      setIsListening(false);
    };

    recognition.start();
  };

  const song = () => {
    console.log("Entering song function...");
    speak("Which song would you like to learn?", () => {
      startListeningForSong(); // Start listening for the song after speaking
    });
  };

  const startListeningForSong = () => {
    console.log("Starting listening for song...");
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Listening for song input...");
      setIsListening(true);
    };
    
    recognition.onresult = async (event) => {
      const song = event.results[0][0].transcript;
      console.log("Song input received:", song);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "User", text: song },
      ]);
      speak(`You said: ${song}. Let me teach you how to play that song.`, () => {
        generateResponse("song", song, () => {
          askToContinue(); // Continue asking if they want to learn more
        });
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Song listening ended.");
      setIsListening(false);
    };

    recognition.start();
  };

  const generateResponse = async (type, input, callback) => {
    console.log("Generating response...");
    if (!input) {
      alert("Please provide some input first!");
      return;
    }
    try {
      const fullPrompt =
        type === "chord"
          ? `You are teaching guitar to a blind person. This is what they said: "${input}" name the chord first and then tell them how to play it.`
          : `You are teaching guitar to a blind person. This is what they have requested: "${input}". To teach them, we have a system that reads out whatever you reply with.`;

      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();
      setResponse(responseText);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "Agent", text: responseText },
      ]);
      speak(responseText, callback); // Convert the Gemini response into speech, then callback
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while fetching the response.");
      speak("Sorry, an error occurred while fetching the response.", callback);
    }
  };

  const askToContinue = () => {
    console.log("Asking if user wants to continue...");
    speak("Would you like to learn another chord or song?", () => {
      startListeningToContinue(); // Start listening after asking
    });
  };

  const startListeningToContinue = () => {
    console.log("Listening for continue response...");
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("Listening for continue response...");
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const continueResponse = event.results[0][0].transcript;
      console.log("Continue response received:", continueResponse);

      if (continueResponse.toLowerCase().includes("yes")) {
        speak("Great! Let's continue.", () => {
          if (userChoice === "chord") {
            chord();
          } else {
            song();
          }
        });
      } else if (continueResponse.toLowerCase().includes("no")) {
        speak("Thanks for using the app! See you next time.", () => {
          setIsActive(false);
        });
      } else {
        speak("Sorry, I didn't understand that. Please say 'yes' or 'no'.", () => {
          startListeningToContinue();
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Listening for continue response ended.");
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="app-container flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {isActive ? (
        <>
          <div className="chat-container w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
            <div className="user-response bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-400">User:</h4>
              <p className="text-base">{prompt}</p>
            </div>
            <div className="agent-response bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-indigo-400">Agent:</h4>
              <p className="text-base">{response}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="welcome-container text-center bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-indigo-500 mb-4">Welcome to Guitar Tutor!</h1>
          <p className="text-lg text-gray-400">Press the spacebar to get started.</p>
        </div>
      )}
    </div>
  );
};

export default GuitarTutor;
