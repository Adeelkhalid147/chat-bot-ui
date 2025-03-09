
import React, { useEffect, useRef } from 'react';
import Image from "next/image";

interface ChatboxProps {
  messages: { type: 'user' | 'ai'; content: string }[];
}

const Chatbox: React.FC<ChatboxProps> = ({ messages }) => {
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatboxRef} className="h-[28rem] p-4 overflow-y-auto bg-white flex flex-col rounded-lg shadow-lg">
      {messages.map((message, index) => (
        <div
          className={`p-2 m-3 rounded-lg shadow-md max-w-[80%] ${
            message.type === "user" 
              ? "bg-blue-100 self-end" 
              : "bg-gray-100 self-start"
          }`}
          key={index}
        >
          {message.content.startsWith("data:image/") ? (
            <Image
              src={message.content}
              alt="Uploaded content"
              width={300}
              height={300}
              className="max-w-full h-auto rounded-lg"
            />
          ) : message.content.match(/https?:\/\/.*\.(?:png|jpg|jpeg|gif)/i) ? (
            <div className="flex flex-col">
              <Image
                src={message.content}
                alt="URL content"
                width={300}
                height={300}
                className="max-w-full h-auto rounded-lg"
              />
              <span className="text-xs text-gray-500 mt-1">
                {message.content}
              </span>
            </div>
          ) : (
            <span className="whitespace-pre-wrap break-words">
              {message.content}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chatbox;


