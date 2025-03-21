import { Conversation, ChatSettings } from "@/types/chat";

const CONVERSATIONS_KEY = "claude-chatbot-conversations";
const SETTINGS_KEY = "claude-chatbot-settings";
const CURRENT_CONVERSATION_KEY = "claude-chatbot-current-conversation";

export const chatStorage = {
  saveConversations(conversations: Conversation[]): void {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  },

  getConversations(): Conversation[] {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    if (!data) return [];
    
    try {
      const parsed = JSON.parse(data) as Conversation[];
      // Convert string dates back to Date objects
      return parsed.map(convo => ({
        ...convo,
        createdAt: new Date(convo.createdAt),
        updatedAt: new Date(convo.updatedAt),
        messages: convo.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error("Error parsing conversations from storage:", error);
      return [];
    }
  },

  saveCurrentConversationId(id: string | null): void {
    if (id) {
      localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    }
  },

  getCurrentConversationId(): string | null {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  },

  saveSettings(settings: ChatSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getSettings(): ChatSettings {
    const data = localStorage.getItem(SETTINGS_KEY);
    const defaultSettings: ChatSettings = {
      apiKey: "",
      model: "claude-3-haiku-20240307",
      temperature: 0.7,
      maxTokens: 1000
    };
    
    if (!data) return defaultSettings;
    
    try {
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
      console.error("Error parsing settings from storage:", error);
      return defaultSettings;
    }
  },

  clearAll(): void {
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    // Optionally keep settings: localStorage.removeItem(SETTINGS_KEY);
  }
};
