import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import UI from "../UI";

const GuitarTutor = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const genAI = new GoogleGenerativeAI("AIzaSyDCywE6KFR6q2qeZClgoO2nZoKRtMeBYH8");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const synth = window.speechSynthesis;

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);


    const voices = synth.getVoices();
    utterance.voice = voices[101];
    utterance.rate = 1;
    utterance.onend = callback;
    synth.speak(utterance);
  };


  useEffect(() => {

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
    speak("Hey, what's Up!! Melody A I here. Welcome to Blind Melodies!! Feel the Strings, Hear the Chords, Play the Song!! ", () => {
      AskUser()
    });
  };

  const AskUser = () => {
    console.log("Greeting user...");
    speak(" Tell me what would you like to learn? a chord or a song ?", () => {
      startListening();
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
        if (text.toLowerCase().includes("chord")) {
          setUserChoice("chord");
          chord();
        } else if (text.toLowerCase().includes("song")) {
          setUserChoice("song");
          song();
        } else {
          speak("Sorry, I didn't catch that. Please tell me if you want to learn a chord or a song.", () => {
            startListening();
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
          askToContinue();
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
          ? `You are teaching guitar to a blind person. This is what they said: "${input}".name the chord first and then tell them:
              \"so we are learing (chord name). To play this chord:put your: \" .
              Give them which finger goes to which string on which fret and the strings they are supposed to strum, add one line of special
              tips or tricks that would help them learn that chord easily for blind person nothing more nothing less. use along space after giving istruction
              for one string so thay have time to actuly follow the instruction. absolutely avoid using special charecterslike *** , . / \ [] # etc. 
              To teach them, we have a system that reads out whatever you reply with. Make sure that chords like Am C# are written as A minor C sharp.`

          : `You are teaching guitar to a blind person. This is what they have requested: "${input}". To teach them, we have a system that reads out whatever you reply with. absolutely avoid using special charecterslike *** , . / \ [] # etc. 
             Give the name of the chords in between the lyrics of the song where they are supposed to change chords. To not make it too long. Give only for verse 1
            Make sure that chords like Am C# are written as A minor C sharp. Also remember that you are the person speaking to the blind person`;

      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();
      setResponse(responseText);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "Agent", text: responseText },
      ]);
      speak(responseText, () => {

        AskUser();

      }

      );

    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while fetching the response.");
      speak("Sorry, an error occurred while fetching the response.", callback);
    }
  };





  return (
    <div>
      <UI />
    </div>
  );
};

export default GuitarTutor;
