"use client"
import React, { useState } from "react";


interface InputProps {
  onSendMessage: (message: string) => void;
}

const Input: React.FC<InputProps>  = ({ onSendMessage }) => {
  // input value ko store krne k liye
  const [message, setMessage] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") {
      alert("Please enter a message before sending");
      return; 
    }

    onSendMessage(message);
    setMessage(""); // Clear the input field after sending
  };

  // Enter Button functionality
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };



  return (
    <div className=" flex justify-center items-end h-full bg-slate-200">
      <input
        className="border border-gray-200 rounded-xl w-full mr-4 p-4 focus:outline-none focus:border-slate-500"
        type="text"
        placeholder="Ask me anything..."
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} 
        value={message}
      />

      <div className="flex justify-center items-center h-full my-1">
        <button className="bg-pink-300 border border-pink-600 rounded-lg h-12 px-4" onClick={handleSendMessage}>
          send
        </button>
      </div>
    </div>
  );
};

export default Input;


