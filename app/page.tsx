// "use client"
// import React, { useState } from "react"; 
// import Chatbox from "./components/chatbox";
// import Input from "./components/input";
// import axios from "axios";


// export default function Home() {
//   const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);

//   // new messages 
//   const handleSendMessage = async (newMessage: string, imageUrl?: string) => {

//     setMessages((prevMessages) => [...prevMessages, { type:'user', content: newMessage}]);
//     // setTimeout(() =>{

//     //   setMessages((prevMessages) =>[...prevMessages, "Thank you for your message"]);
//     // },1000)
//     try {
//       // prepare the payload for flask api
//       const payload = {
//         message: newMessage,
//       };
//       if (imageUrl) {
//         payload.image_url = imageUrl;
//       }
//       // Send user message to Flask API and get the response
//       const response = await axios.post("http://localhost:5000/chat", payload);
  
//       // Delay of 1 second before showing AI response
//       setTimeout(() => {
//         setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: response.data.response}]);
//       }, 1000);  // 1 second delay
//     } catch (error) {
//       console.error("Error communicating with Flask API:", error);
//       setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: "Error: Could not get a response from the server."}]);
//     }

   

//   }
//   return (
//     // Main
//     <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4l">
//       {/* Heading */}
//       <div>
//       <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">AI CHATBOT</h1>
//       </div>
      
//       {/* Chatbox */}
//       <div className=" bg-stone-100 w-full max-w-screen-md flex-grow border rounded-lg shadow-lg mb-6">
//       <Chatbox messages={messages}/>
//       </div>
//       <div className=" bg-stone-100 w-full max-w-screen-md border shadow-lg rounded-lg mb-4">
//       <Input onSendMessage={handleSendMessage}/>
//       </div>

//     </div>
//   );
// }




"use client";
import React, { useState } from "react";
import Chatbox from "./components/chatbox";
import Input from "./components/input";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);

  const handleSendMessage = async (newMessage: string, files?: File[], imageUrls?: string[]) => {
    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { type: 'user', content: newMessage }]);

    // add image URL to the chat if provided
    if (imageUrls && imageUrls.length > 0) {
      setMessages((prevMessages) => [...prevMessages, { type: 'user', content: imageUrls[0] }])
    }

    try {
      // Prepare the payload for Flask API
      const payload: { message: string; image_url?: string } = {
        message: newMessage,
      };

      // Add image URL if provided
      if (imageUrls && imageUrls.length > 0) {
        payload.image_url = imageUrls[0]; // Use the first image URL
      }

      // Send user message to Flask API and get the response
      const response = await axios.post("http://localhost:5000/chat", payload);

      // Add AI response to the chat after a delay
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: response.data.response }]);
      }, 1000);  // 1 second delay
    } catch (error) {
      console.error("Error communicating with Flask API:", error);
      setMessages((prevMessages) => [...prevMessages, { type: 'ai', content: "Error: Could not get a response from the server." }]);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">AI CHATBOT</h1>
      </div>

      {/* Chatbox */}
      <div className="bg-stone-100 w-full max-w-screen-md flex-grow border rounded-lg shadow-lg mb-6">
        <Chatbox messages={messages} />
      </div>

      {/* Input */}
      <div className="bg-stone-100 w-full max-w-screen-md border shadow-lg rounded-lg mb-4">
        <Input onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}