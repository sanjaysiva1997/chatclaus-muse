import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  X, 
  Menu,
  MessageSquare, 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ConversationSidebar: React.FC = () => {
  const { 
    conversations, 
    currentConversation, 
    createNewConversation, 
    setCurrentConversation,
    deleteConversation,
    settings,
    setSettings,
    clearConversations
  } = useChat();
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    // If today, show time only
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleConversationClick = (id: string) => {
    setCurrentConversation(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      
      <div className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col w-80 transition-all duration-300 ease-in-out z-40",
        isMobile ? "fixed" : "relative",
        isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Claude Chat</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="p-2">
          <Button 
            className="w-full gap-2 bg-primary hover:bg-primary/90 transition-colors"
            onClick={createNewConversation}
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                conversation.id === currentConversation?.id && 
                "bg-gray-100 dark:bg-gray-800"
              )}
              role="button"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="flex-1 truncate">
                {conversation.title || "New Conversation"}
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(conversation.updatedAt)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </ScrollArea>
        
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Claude API Key</Label>
              <Input
                type="password"
                value={settings.apiKey}
                onChange={(e) => 
                  setSettings({ ...settings, apiKey: e.target.value })
                }
                placeholder="Enter your Claude API key"
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature ({settings.temperature})</Label>
              <Slider
                value={[settings.temperature]}
                onValueChange={([value]) => 
                  setSettings({ ...settings, temperature: value })
                }
                step={0.1}
                min={0}
                max={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Tokens ({settings.maxTokens})</Label>
              <Slider
                value={[settings.maxTokens]}
                onValueChange={([value]) => 
                  setSettings({ ...settings, maxTokens: value })
                }
                step={100}
                min={100}
                max={4000}
              />
            </div>
            <div className="pt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  clearConversations();
                  setSettingsOpen(false);
                }}
              >
                Clear All Conversations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationSidebar;
