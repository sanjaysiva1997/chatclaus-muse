
import React, { useState } from "react";
import { Copy, Check, User, RefreshCw } from "lucide-react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  isLast: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLast }) => {
  const [copied, setCopied] = useState(false);
  const { isLoading } = useChat();
  const isAssistant = message.role === "assistant";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    // Replace code blocks
    let formattedContent = content.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>'
    );
    
    // Replace inline code
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>'
    );
    
    // Replace line breaks with <br/>
    formattedContent = formattedContent.replace(/\n/g, '<br/>');
    
    return formattedContent;
  };

  return (
    <div
      className={cn(
        "py-6 px-4 sm:px-6 message-appear",
        isAssistant 
          ? "bg-gray-50 dark:bg-gray-900/50" 
          : "bg-white dark:bg-gray-900"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isAssistant 
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        )}>
          {isAssistant ? (
            <svg 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 18L15 12L9 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          ) : (
            <User className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="prose dark:prose-invert max-w-none break-words">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: formatMessageContent(message.content) 
              }} 
            />
          </div>
          <div className="mt-2 flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            {isAssistant && isLast && isLoading && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Regenerating...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
