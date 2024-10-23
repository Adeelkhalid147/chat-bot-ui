"use client"
import React, { useState } from "react"; 
import Chatbox from "./components/chatbox";
import Input from "./components/input";
import axios from "axios";


export default function Home() {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);

  // new messages 
  const handleSendMessage = async (newMessage: string) => {

    setMessages((prevMessages) => [...prevMessages, { type:'user', content: newMessage}]);
    // setTimeout(() =>{

    //   setMessages((prevMessages) =>[...prevMessages, "Thank you for your message"]);
    // },1000)
    try {
      // Send user message to Flask API and get the response
      const response = await axios.post("http://localhost:5000/chat", { message: newMessage });
  
      // Delay of 1 second before showing AI response
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: response.data.response}]);
      }, 1000);  // 1 second delay
    } catch (error) {
      console.error("Error communicating with Flask API:", error);
      setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: "Error: Could not get a response from the server."}]);
    }

   

  }
  return (
    // Main
    <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4l">
      <div>hello</div>
      {/* Heading */}
      <div>
      <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">AI CHATBOT</h1>
      </div>
      
      {/* Chatbox */}
      <div className=" bg-stone-100 w-full max-w-screen-md flex-grow border rounded-lg shadow-lg mb-6">
      <Chatbox messages={messages}/>
      </div>
      <div className=" bg-stone-100 w-full max-w-screen-md border shadow-lg rounded-lg mb-4">
      <Input onSendMessage={handleSendMessage}/>
      </div>

    </div>
  );
}
