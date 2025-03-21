
import { ChatProvider } from "@/contexts/ChatContext";
import ConversationSidebar from "@/components/ConversationSidebar";
import ChatArea from "@/components/ChatArea";

const Index = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
        <ConversationSidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
};

export default Index;
