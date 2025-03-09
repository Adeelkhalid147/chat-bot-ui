

'use client';
import React, { useState, useRef } from 'react';
import { MdOutlineSettingsVoice, MdSend } from "react-icons/md";
import { LiaPlusSolid } from "react-icons/lia";
import Image from "next/image";

interface InputProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

const AudioTranscription: React.FC<InputProps> = ({ onSendMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            setMessage(result.text || "");
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

  const handleSend = () => {
    if (message.trim() === "" && selectedFiles.length === 0) {
      alert("Please enter a message or attach files before sending");
      return;
    }
    onSendMessage(message, selectedFiles);
    setMessage("");
    setSelectedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        setFileError("File size exceeds 50MB limit");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setFileError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-center bg-slate-200 w-full p-4 rounded-xl shadow-lg">
        <div className="flex flex-col w-full mr-4">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      width={100}
                      height={100}
                      className="max-w-[100px] max-h-[100px] rounded-lg"
                    />
                  ) : (
                    <div className="max-w-[100px] max-h-[100px] rounded-lg bg-gray-100 p-2 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{file.name}</span>
                    </div>
                  )}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => handleRemoveFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            className="border border-gray-200 rounded-xl w-full p-4 focus:outline-none focus:border-slate-500"
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex items-center space-x-2">
          <LiaPlusSolid
            className="size-9 rounded-full h-12 bg-pink-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png"
            multiple
          />
          <MdOutlineSettingsVoice
            className={`size-9 rounded-full h-12 bg-pink-300 cursor-pointer ${isRecording ? 'animate-pulse' : ''}`}
            onClick={handleRecording}
          />
          <button
            className={`bg-pink-300 border border-pink-600 rounded-lg h-12 px-4 flex items-center justify-center ${
              (message || selectedFiles.length > 0) ? '' : 'hidden'
            }`}
            onClick={handleSend}
          >
            <MdSend className="size-6" />
          </button>
        </div>
      </div>
      {fileError && <div className="mt-2 text-red-500">{fileError}</div>}
    </div>
  );
};

export default AudioTranscription;

