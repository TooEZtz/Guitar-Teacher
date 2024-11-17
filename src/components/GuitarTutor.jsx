import React, { useState } from "react";
import Input from "./GetInput";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEN_AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const generateResponse = async () => {
        if (!prompt) {
            alert("Please provide some input first!");
            return;
        }
        setIsLoading(true);
        try {
            const fullPrompt =
                `You are talking to a blind person. This is what they said: "` +
                prompt +
                `"provide the lyrics along with the chords.
                `;

            const result = await model.generateContent(fullPrompt);
            setResponse(result.response.text());
        } catch (error) {
            console.error("Error generating response:", error);
            setResponse("An error occurred while fetching the response.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Teach a Blind Person Guitar Chords</h1>

            {/* Input Component */}
            <Input setPrompt={setPrompt} />

            {/* Generate Response Button */}
            <button
                onClick={generateResponse}
                className={`mt-4 px-6 py-2 text-white font-semibold rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Generate Instructions"}
            </button>

            {/* Display the Response */}
            {response && (
                <div className="mt-6 bg-white shadow-md rounded p-4 w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-2">Gemini API Response:</h2>
                    <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                </div>
            )}
        </div>
    );
};

export default App;
