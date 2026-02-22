
import React, { useState, useRef } from 'react';
import { 
  Paperclip, 
  Globe, 
  Zap, 
  Folder, 
  Send,
  Mic,
  Square,
  Wrench
} from 'lucide-react';

interface LegalInputProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

const LegalInput: React.FC<LegalInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setInput("Summarize the Kenyan Land Registration Act regarding conveyancing requirements.");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative max-w-4xl w-full mx-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/5 border border-gray-100 p-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Lawlify anything... (e.g., 'Help me draft a contract')"
          className="w-full h-32 text-xl text-black placeholder-gray-300 focus:outline-none resize-none border-none p-0 font-medium"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <ToolButton icon={<Paperclip className="w-5 h-5" />} />
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-black text-black bg-gray-50 border border-gray-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all uppercase tracking-widest">
              <Wrench className="w-4 h-4" />
              Tools
            </button>
            <ToolButton icon={<Globe className="w-5 h-5" />} />
            <ToolButton icon={<Zap className="w-5 h-5" />} />
            <ToolButton icon={<Folder className="w-5 h-5" />} />
          </div>

          <div className="flex items-center gap-4">
             <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-2xl transition-all shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
            >
              {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {isRecording && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl animate-bounce">
            Lawlify is listening...
          </div>
        </div>
      )}
    </div>
  );
};

const ToolButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-2.5 text-gray-400 hover:text-black transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded-xl">
    {icon}
  </button>
);

export default LegalInput;
