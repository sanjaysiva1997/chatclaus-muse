
import { toast } from "sonner";
import { Message, ChatSettings } from "@/types/chat";

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-3-haiku-20240307";

export async function sendMessageToClaude(
  messages: Message[],
  settings: ChatSettings
): Promise<string> {
  try {
    if (!settings.apiKey) {
      throw new Error("Claude API key is not set");
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": settings.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: settings.model || DEFAULT_MODEL,
        messages: formattedMessages,
        max_tokens: settings.maxTokens || 1000,
        temperature: settings.temperature || 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to communicate with Claude API");
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(errorMessage);
    console.error("Claude API Error:", error);
    return "I'm sorry, I couldn't process your request. Please check your API key and network connection.";
  }
}

// Mock function to test without actual API calls
export function mockClaudeResponse(messages: Message[]): Promise<string> {
  return new Promise((resolve) => {
    const userMessage = messages[messages.length - 1].content;
    setTimeout(() => {
      resolve(`This is a mock response to: "${userMessage}". In a real implementation, this would come from Claude API.`);
    }, 1000);
  });
}
