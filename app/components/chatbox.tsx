import React, { useEffect, useRef } from 'react'
import Image from "next/image"


interface ChatboxProps {
  messages: {type: 'user' | 'ai'; content: string}[];
}
const Chatbox: React.FC<ChatboxProps>  = ({ messages }) => {
  const chatboxRef = useRef<HTMLDivElement | null>(null); // message ka referance bnane k liye

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    const chatbox = chatboxRef.current;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    }
  }, [messages]);
  return (
    <div ref={chatboxRef}  className='h-[28rem] p-4 overflow-y-auto bg-white flex flex-col rounded-lg shadow-lg'>
      { messages.map((message,index)=>(
        <div className={`p-2 m-3 rounded-lg shadow-md ${message.type === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`} key={index}>
          {/* display image if content is a URL */}
          {message.content.startsWith('http') && (message.content.endsWith('.jpg') || message.content.endsWith('.jpeg') || message.content.endsWith('.png')) ? (
            <Image src={message.content} alt="User provided"width={600} height={600} className='max-w-full h-auto rounded-lg'/>
          ) : (
          <span className='whitespace-pre-wrap break-words w-full'>{message.content}</span>
          )}
          </div>
      ))}
      </div>
  )
}

export default Chatbox