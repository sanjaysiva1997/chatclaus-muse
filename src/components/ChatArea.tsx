
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatArea: React.FC = () => {
  const { currentConversation } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Select or create a conversation to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ScrollArea 
        ref={scrollRef}
        className="flex-1"
      >
        <div className={isMobile ? "pt-16" : ""}>
          {currentConversation.messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isLast={index === currentConversation.messages.length - 1}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput />
    </div>
  );
};

export default ChatArea;
