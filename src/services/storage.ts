
import { Message, ChatSettings } from "@/types/chat";

const MESSAGES_KEY = "claude-chatbot-messages";
const SETTINGS_KEY = "claude-chatbot-settings";

export const chatStorage = {
  saveMessages(messages: Message[]): void {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  getMessages(): Message[] {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (!data) return [];
    
    try {
      const parsed = JSON.parse(data) as Message[];
      // Convert string dates back to Date objects
      return parsed.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error("Error parsing messages from storage:", error);
      return [];
    }
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

  clearMessages(): void {
    localStorage.removeItem(MESSAGES_KEY);
  },

  clearAll(): void {
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }
};
