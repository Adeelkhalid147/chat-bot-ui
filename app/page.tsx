// "use client";
// import React, { useState } from "react";
// import Chatbox from "./components/chatbox";
// import Input from "./components/input";
// import axios from "axios";

// export default function Home() {
//   const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);

//   const handleSendMessage = async (newMessage: string, files?: File[], imageUrls?: string[]) => {
//     // Add user message to the chat (even if it's empty)
//     setMessages((prevMessages) => [...prevMessages, { type: 'user', content: newMessage || "(No prompt)" }]);

//     // Check if the message contains an image URL
//     const isImageUrl = newMessage.match(/https?:\/\/.*\.(?:png|jpg|jpeg|gif)/i);

//     try {
//       // Prepare the payload for Flask API
//       const payload: { message: string; image_url?: string } = {
//         message: newMessage || "", // Default to empty string if no prompt
//       };

//       // Handle local image file (convert to base64)
//       if (files && files.length > 0) {
//         const file = files[0];
//         const reader = new FileReader();
//         reader.onload = async () => {
//           const base64Image = reader.result as string;
//           payload.image_url = base64Image; // Send base64-encoded image

//           // add image to chatbox before send request
//           setMessages((prevMessages)=> [...prevMessages, {type: 'user', content: base64Image},  // add image to chatbox
//           ]);

//           // Send user message to Flask API and get the response
//           const response = await axios.post("http://localhost:5000/chat", payload, {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });

//           // Add AI response to the chat after a delay
//           setTimeout(() => {
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               { type: 'ai', content: response.data.response },
//             ]);
//           }, 1000); // 1 second delay
//         };
//         reader.readAsDataURL(file); // Convert file to base64
//       } else if (imageUrls) {
//         // Handle pasted image URL
//         payload.image_url = imageUrls[0]; // Send the image URL directly

//         // add image to chatbox before sending request
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { type: 'user', content: isImageUrl[0] }, // Add image to chatbox
//         ]);

//         // Send user message to Flask API and get the response
//         const response = await axios.post("http://localhost:5000/chat", payload, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         // Add AI response to the chat after a delay
//         setTimeout(() => {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { type: 'ai', content: response.data.response },
//           ]);
//         }, 1000); // 1 second delay
//       } else {
//         // No image, send only the message
//         const response = await axios.post("http://localhost:5000/chat", payload, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         // Add AI response to the chat after a delay
//         setTimeout(() => {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { type: 'ai', content: response.data.response },
//           ]);
//         }, 1000); // 1 second delay
//       }
//     } catch (error) {
//       console.error("Error communicating with Flask API:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: 'ai', content: "Error: Could not get a response from the server." },
//       ]);
//     }
//   };

//   return (
//     <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4">
//       {/* Heading */}
//       <div>
//         <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">AI CHATBOT</h1>
//       </div>

//       {/* Chatbox */}
//       <div className="bg-stone-100 w-full max-w-screen-md flex-grow border rounded-lg shadow-lg mb-6">
//         <Chatbox messages={messages} />
//       </div>

//       {/* Input */}
//       <div className="bg-stone-100 w-full max-w-screen-md border shadow-lg rounded-lg mb-4">
//         <Input onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// }

// madam

"use client";
import React, { useState } from "react";
import Chatbox from "./components/chatbox";
import Input from "./components/input";
import axios from "axios";

interface Message {
  type: "user" | "ai";
  text?: string;
  images?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (
    newMessage: string,
    files: File[],
    imageUrls: string[]
  ) => {
    // Convert files to base64
    const filePromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    try {
      const base64Images = await Promise.all(filePromises);
      const allImages = [...base64Images, ...imageUrls];

      // Create a single user message with text and images
      const userMessage: Message = {
        type: "user",
        text: newMessage || undefined,
        images: allImages.length > 0 ? allImages : undefined,
      };

      // Add the user message to the chat
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Prepare the payload for Flask API
      const payload = {
        message: newMessage || "",
        image_urls: allImages,
      };

      // Send request to Flask API
      const response = await axios.post("http://localhost:5000/chat", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Add AI response to the chat after a delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", text: response.data.response },
        ]);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error communicating with Flask API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          text: "Error: Could not get a response from the server.",
        },
      ]);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen w-full flex flex-col items-center justify-between p-4">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-blue-600 text-center pt-5 mb-10">
          AI CHATBOT
        </h1>
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
