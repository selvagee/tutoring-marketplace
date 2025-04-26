import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Search } from "lucide-react";
import { useState } from "react";

interface ConversationListProps {
  conversations: any[];
  selectedUserId: number | null;
  onSelectConversation: (userId: number) => void;
  isLoading: boolean;
}

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  isLoading
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return conversation.user?.fullName?.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery ? (
              <p className="text-gray-500">No conversations match your search</p>
            ) : (
              <div className="p-4">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No conversations yet. Contact a tutor to start chatting.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <Button
                key={conversation.userId}
                variant="ghost"
                className={`w-full justify-start rounded-none py-4 px-4 ${
                  selectedUserId === conversation.userId
                    ? "bg-primary-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectConversation(conversation.userId)}
              >
                <div className="flex items-center w-full">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage 
                      src={conversation.user?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${conversation.user?.fullName}`} 
                    />
                    <AvatarFallback>{conversation.user?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        selectedUserId === conversation.userId
                          ? "text-primary"
                          : "text-gray-900"
                      }`}>
                        {conversation.user?.fullName}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="rounded-full px-2 py-0.5 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.user?.role === "student" ? "Student" : "Tutor"}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
