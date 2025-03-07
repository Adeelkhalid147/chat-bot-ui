// import React, { useEffect, useRef } from 'react'
// import Image from "next/image"

// interface ChatboxProps {
//   messages: {type: 'user' | 'ai'; content: string}[];
// }
// const Chatbox: React.FC<ChatboxProps>  = ({ messages }) => {
//   const chatboxRef = useRef<HTMLDivElement | null>(null); // message ka referance bnane k liye

//   useEffect(() => {
//     // Scroll to the bottom whenever messages change
//     const chatbox = chatboxRef.current;
//     if (chatbox) {
//       chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
//     }
//   }, [messages]);
//   return (
//     <div
//       ref={chatboxRef}
//       className="h-[28rem] p-4 overflow-y-auto bg-white flex flex-col rounded-lg shadow-lg"
//     >
//       {messages.map((message, index) => (
//         <div
//           className={`p-2 m-3 rounded-lg shadow-md ${
//             message.type === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
//           }`}
//           key={index}
//         >
//           {/* Display image if content is a URL or base64 string */}
//           {message.content.startsWith("data:image/") ||
//           message.content.match(/https?:\/\/.*\.(?:png|jpg|jpeg|gif)/i) ? (
//             <Image src={message.content} alt= "User upload image" width={300} height={300} className="max-w-full h-auto rounded-lg"
//             />
//           ) : (
//             <span className="whitespace-pre-wrap break-words w-full">
//               {message.content}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Chatbox;

// app\components\chatbox.tsx
import React from "react";
import Image from "next/image";

interface Message {
  type: "user" | "ai";
  text?: string;
  images?: string[];
}

interface ChatboxProps {
  messages: Message[];
}

const Chatbox: React.FC<ChatboxProps> = ({ messages }) => {
  return (
    <div className="p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.type === "user" ? "text-right" : "text-left"
          }`}
        >
          {/* Display text if it exists */}
          {message.text && (
            <p className="bg-gray-200 p-2 rounded inline-block max-w-md">
              {message.text}
            </p>
          )}

          {/* Display images if they exist */}
          {message.images && message.images.length > 0 && (
            <div className="mt-2">
              {message.images.map((image, imgIndex) => (
                <Image
                  key={imgIndex}
                  src={image}
                  alt={`Image ${imgIndex + 1}`}
                  width={300}
                  height={300}
                  className="max-w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chatbox;
