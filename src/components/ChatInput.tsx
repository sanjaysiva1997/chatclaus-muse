
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${scrollHeight}px`;
      
      const newRows = Math.min(
        Math.max(Math.floor(scrollHeight / 24), 1),
        5
      );
      setRows(newRows);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      await sendMessage(message.trim());
      setMessage("");
      setRows(1);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    // In a real app, this would integrate with the Web Speech API
    setIsRecording(!isRecording);
    if (isRecording) {
      // Stop recording and process result
      setIsRecording(false);
      // This is where you'd add the transcribed text to the message
      setMessage(prev => prev + " [Voice transcription would appear here]");
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-slide-up"
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={rows}
          className="py-3 pr-10 resize-none rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          disabled={isLoading}
        />
        <div className="absolute right-3 bottom-3">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <StopCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-all"
        disabled={!message.trim() || isLoading}
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
