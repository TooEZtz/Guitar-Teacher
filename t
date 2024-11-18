const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice and rate
    const voices = synth.getVoices();
    utterance.voice =
        voices.find((voice) => voice.name === "Google UK English Male") || voices[0]; // Replace with desired voice name
    utterance.rate = 0.8; // Slower pace

    utterance.onend = callback; // Callback after speech ends
    synth.speak(utterance);
};