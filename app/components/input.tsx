// "use client"
// import React, { useState } from "react";
// import { MdOutlineSettingsVoice } from "react-icons/md";



// interface InputProps {
//   onSendMessage: (message: string) => void;
// }

// const Input: React.FC<InputProps>  = ({ onSendMessage }) => {
//   // input value ko store krne k liye
//   const [message, setMessage] = useState("")

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(event.target.value);
//   };

//   const handleSendMessage = () => {
//     if (message.trim() === "") {
//       alert("Please enter a message before sending");
//       return; 
//     }

//     onSendMessage(message);
//     setMessage(""); // Clear the input field after sending
//   };

//   // Enter Button functionality
//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       handleSendMessage();
//     }
//   };



//   return (
//     <div className=" flex justify-center items-end h-full bg-slate-200">
//       <input
//         className="border border-gray-200 rounded-xl w-full mr-4 p-4 focus:outline-none focus:border-slate-500"
//         type="text"
//         placeholder="Ask me anything..."
//         onChange={handleInputChange}
//         onKeyPress={handleKeyPress} 
//         value={message}
//       />

//       <div className="flex justify-center items-center h-full my-1">
//       <MdOutlineSettingsVoice className="size-8 rounded-full h-10 bg-pink-300" />

//         <button className="bg-pink-300 border border-pink-600 rounded-lg h-12 px-4" onClick={handleSendMessage}>
//           send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Input;






// 'use client';

// import { useState, useRef } from 'react';
// import { MdOutlineSettingsVoice } from "react-icons/md";


// const AudioTranscription: React.FC = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcription, setTranscription] = useState('');
//     const [message, setMessage] = useState<string>("");
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const audioChunksRef = useRef<BlobPart[]>([]);

//     const handleRecording = async () => {
//         if (!isRecording) {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//                 const mediaRecorder = new MediaRecorder(stream);
//                 mediaRecorderRef.current = mediaRecorder;
                
//                 mediaRecorder.ondataavailable = (event) => {
//                     audioChunksRef.current.push(event.data);
//                 };

//                 mediaRecorder.onstop = async () => {
//                     const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//                     const formData = new FormData();
//                     formData.append('audio', audioBlob, 'recording.webm');

//                     try {
//                         const response = await fetch('http://localhost:5000/transcribe', {
//                             method: 'POST',
//                             body: formData
//                         });
//                         const result = await response.json();
//                         setTranscription(result.text || ""); // ensure result.text is not undefined
//                         setMessage(result.text || ""); // Highlighted change: Set message input field
//                     } catch (error) {
//                         console.error('Error:', error);
//                     }

//                     audioChunksRef.current = [];
//                     stream.getTracks().forEach(track => track.stop());
//                 };

//                 mediaRecorder.start();
//                 setIsRecording(true);
//             } catch (err) {
//                 console.error('Error accessing microphone:', err);
//             }
//         } else {
//             mediaRecorderRef.current?.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center p-4">
//             <div className="flex justify-center items-end h-full bg-slate-200 w-full max-w-lg p-4 rounded-xl">
//                 <input
//                     className="border border-gray-200 rounded-xl w-full mr-4 p-4 focus:outline-none focus:border-slate-500"
//                     type="text"
//                     placeholder="Ask me anything..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <div className="flex items-center">
//                     <MdOutlineSettingsVoice 
//                         className={`size-8 rounded-full h-10 bg-pink-300 cursor-pointer ${isRecording ? 'animate-pulse' : ''}`} 
//                         onClick={handleRecording} 
//                     />
//                     <button 
//                         className={`bg-pink-300 border border-pink-600 rounded-lg h-12 px-4 ml-2 ${(message || "").trim() === "" ? 'hidden' : ''}`} 
//                         onClick={() => setMessage("")}
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AudioTranscription;











'use client';

import React, { useState, useRef } from 'react';
import { MdOutlineSettingsVoice, MdSend } from "react-icons/md";

interface InputProps {
  onSendMessage: (message: string) => void;
}

const AudioTranscription: React.FC<InputProps> = ({ onSendMessage }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [message, setMessage] = useState<string>("");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);

    const handleRecording = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                
                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recording.webm');

                    try {
                        const response = await fetch('http://localhost:5000/transcribe', {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();
                        // setTranscription(result.text || ""); // ensure result.text is not undefined
                         setMessage(result.text || ""); // Highlighted change: Set message input field
                    } catch (error) {
                        console.error('Error:', error);
                    }

                    audioChunksRef.current = [];
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error('Error accessing microphone:', err);
            }
        } else {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === "") {
            alert("Please enter a message before sending");
            return; 
        }

        onSendMessage(message);
        setMessage(""); // Clear the input field after sending
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex justify-center bg-slate-200 w-full p-4 rounded-xl shadow-lg">
                <input
                    className="border border-gray-200 rounded-xl w-full mr-4 p-4 focus:outline-none focus:border-slate-500"
                    type="text"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <div className="flex items-center space-x-2">
                    <MdOutlineSettingsVoice 
                        className={`size-8 rounded-full h-10 bg-pink-300 cursor-pointer ${isRecording ? 'animate-pulse' : ''}`} 
                        onClick={handleRecording} 
                    />
                    <button 
                        className={`bg-pink-300 border border-pink-600 rounded-lg h-12 px-4 flex items-center justify-center ${(message || "").trim() === "" ? 'hidden' : ''}`} 
                        onClick={handleSendMessage}
                    >
                        <MdSend className="size-6" />
                    </button>
                </div>
            </div>
            {transcription && (
                <div className="mt-4 p-4 bg-white rounded-xl shadow-lg w-full max-w-lg">
                    <p className="text-gray-700">{transcription}</p>
                </div>
            )}
        </div>
    );
};

export default AudioTranscription;