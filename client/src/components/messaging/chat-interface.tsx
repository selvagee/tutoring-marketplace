import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatInterfaceProps {
  messages: any[];
  recipientId: number;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isSending: boolean;
}

export default function ChatInterface({
  messages,
  recipientId,
  onSendMessage,
  isLoading,
  isSending
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch recipient data
  const { data: recipientData } = useQuery({
    queryKey: [`/api/users/${recipientId}`],
    enabled: !!recipientId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffDays < 7) {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        hour: 'numeric', 
        minute: 'numeric' 
      };
      return date.toLocaleString(undefined, options);
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
      };
      return date.toLocaleString(undefined, options);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={recipientData?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${recipientData?.fullName || "User"}`} 
          />
          <AvatarFallback>
            {recipientData?.fullName?.substring(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">
            {recipientData?.fullName || "Loading..."}
          </h3>
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${recipientData?.isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
            <span className="text-sm text-gray-500">
              {recipientData?.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500 mb-4">
                Send a message to begin chatting with {recipientData?.fullName}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={recipientData?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${recipientData?.fullName || "User"}`} 
                        />
                        <AvatarFallback>
                          {recipientData?.fullName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        isCurrentUser
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-primary-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                    {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`} />
                        <AvatarFallback>{user?.fullName?.substring(0, 2) || "Me"}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea 
              placeholder="Type your message..." 
              className="min-h-[80px] resize-none"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={isSending}
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10" 
            disabled={!messageInput.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
