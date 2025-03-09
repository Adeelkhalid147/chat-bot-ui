


"use client";
import React, { useState } from "react";
import Chatbox from "./components/chatbox";
import Input from "./components/input";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);

  const handleSendMessage = async (rawMessage: string, files?: File[]) => {
    // Process message content
    const textContent = rawMessage.trim() || "(No prompt)";
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    const urlMatch = textContent.match(imageUrlRegex);

    // Separate text and image URL
    let displayText = textContent;
    let imageUrl = "";
    
    if (urlMatch) {
      imageUrl = urlMatch[0];
      displayText = textContent.replace(imageUrl, "").trim() || "(No prompt)";
    }

    // Add text message first
    setMessages(prev => [...prev, { type: 'user', content: displayText }]);

    // Handle local files
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Add file image
        setMessages(prev => [...prev, { type: 'user', content: base64Image }]);
        
        // Single API call
        await makeApiRequest(displayText, base64Image);
      };
      reader.readAsDataURL(file);
    }
    // Handle URL images
    else if (imageUrl) {
      // Add URL image
      setMessages(prev => [...prev, { type: 'user', content: imageUrl }]);
      
      // Single API call
      await makeApiRequest(displayText, imageUrl);
    }
    // Text-only
    else {
      await makeApiRequest(displayText);
    }
  };

  const makeApiRequest = async (message: string, image?: string) => {
    try {
      const payload = {
        message: message,
        ...(image && { image_url: image })
      };

      const response = await axios.post("http://localhost:5000/chat", payload);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: response.data.response 
        }]);
      }, 1000);
      
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "Error: Could not get a response from the server." 
      }]);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4">
      <div>
        <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">
          AI CHATBOT
        </h1>
      </div>

      <div className="bg-stone-100 w-full max-w-screen-md flex-grow border rounded-lg shadow-lg mb-6">
        <Chatbox messages={messages} />
      </div>

      <div className="bg-stone-100 w-full max-w-screen-md border shadow-lg rounded-lg mb-4">
        <Input onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}


