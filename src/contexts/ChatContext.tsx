
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Conversation, Message, ChatSettings } from "@/types/chat";
import { chatStorage } from "@/services/storage";
import { sendMessageToClaude, mockClaudeResponse } from "@/services/claude";

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  settings: ChatSettings;
  isLoading: boolean;
  setSettings: (settings: ChatSettings) => void;
  createNewConversation: () => void;
  setCurrentConversation: (conversationId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (conversationId: string) => void;
  clearConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(chatStorage.getSettings());
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from storage on initial load
  useEffect(() => {
    const storedConversations = chatStorage.getConversations();
    setConversations(storedConversations);

    // Set current conversation if one is saved
    const currentId = chatStorage.getCurrentConversationId();
    if (currentId && storedConversations.length > 0) {
      const current = storedConversations.find(c => c.id === currentId);
      if (current) {
        setCurrentConversation(current);
      } else {
        // If saved ID doesn't exist anymore, use the first conversation
        setCurrentConversation(storedConversations[0]);
      }
    } else if (storedConversations.length > 0) {
      // If no saved current but conversations exist, use the first one
      setCurrentConversation(storedConversations[0]);
    } else {
      // If no conversations, create a new one
      createNewConversation();
    }
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      chatStorage.saveConversations(conversations);
    }
  }, [conversations]);

  // Save current conversation ID when it changes
  useEffect(() => {
    if (currentConversation) {
      chatStorage.saveCurrentConversationId(currentConversation.id);
    }
  }, [currentConversation?.id]);

  // Save settings when they change
  useEffect(() => {
    chatStorage.saveSettings(settings);
  }, [settings]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    if (currentConversation?.id === updatedConversation.id) {
      setCurrentConversation(updatedConversation);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) return;
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date()
    };

    // Update conversation with user message
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date()
    };
    
    // If this is the first message, set a better title
    if (currentConversation.messages.length === 0) {
      const title = content.length > 30 
        ? `${content.substring(0, 30)}...` 
        : content;
      updatedConversation.title = title;
    }
    
    updateConversation(updatedConversation);
    setCurrentConversation(updatedConversation);

    // Get Claude's response
    setIsLoading(true);
    try {
      // Use all messages for context
      const response = settings.apiKey 
        ? await sendMessageToClaude(updatedConversation.messages, settings)
        : await mockClaudeResponse(updatedConversation.messages);

      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };

      // Update conversation with assistant response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      updateConversation(finalConversation);
      setCurrentConversation(finalConversation);
    } catch (error) {
      console.error("Error getting Claude response:", error);
      toast.error("Failed to get a response from Claude");
    } finally {
      setIsLoading(false);
    }
  };

  const changeCurrentConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If we're deleting the current conversation, switch to another
    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      if (remaining.length > 0) {
        setCurrentConversation(remaining[0]);
      } else {
        createNewConversation();
      }
    }
  };

  const clearConversations = () => {
    setConversations([]);
    createNewConversation();
    chatStorage.clearAll();
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        settings,
        isLoading,
        setSettings,
        createNewConversation,
        setCurrentConversation: changeCurrentConversation,
        sendMessage,
        deleteConversation,
        clearConversations
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
