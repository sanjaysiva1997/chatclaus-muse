
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Message, ChatSettings } from "@/types/chat";
import { chatStorage } from "@/services/storage";
import { sendMessageToClaude, mockClaudeResponse } from "@/services/claude";

interface ChatContextType {
  messages: Message[];
  settings: ChatSettings;
  isLoading: boolean;
  setSettings: (settings: ChatSettings) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ChatSettings>(chatStorage.getSettings());
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from storage on initial load
  useEffect(() => {
    const storedMessages = chatStorage.getMessages();
    setMessages(storedMessages);
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    chatStorage.saveMessages(messages);
  }, [messages]);

  // Save settings when they change
  useEffect(() => {
    chatStorage.saveSettings(settings);
  }, [settings]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date()
    };

    // Update messages with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Get Claude's response
    setIsLoading(true);
    try {
      // Use all messages for context
      const response = settings.apiKey 
        ? await sendMessageToClaude(updatedMessages, settings)
        : await mockClaudeResponse(updatedMessages);

      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };

      // Update messages with assistant response
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error getting Claude response:", error);
      toast.error("Failed to get a response from Claude");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    chatStorage.clearMessages();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        settings,
        isLoading,
        setSettings,
        sendMessage,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
