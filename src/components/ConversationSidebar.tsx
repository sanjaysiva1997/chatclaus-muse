
import React, { useState } from "react";
import { 
  Trash2, 
  Settings, 
  X, 
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ConversationSidebar: React.FC = () => {
  const { 
    settings,
    setSettings,
    clearChat
  } = useChat();
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
        
        <div className="flex-1 p-4">
          <p className="text-sm text-gray-500 mb-4">
            Chat with Claude AI assistant using the natural language. Your conversations are saved locally on your device.
          </p>
          
          <Button
            variant="outline"
            className="w-full gap-2 mb-4"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={clearChat}
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationSidebar;
