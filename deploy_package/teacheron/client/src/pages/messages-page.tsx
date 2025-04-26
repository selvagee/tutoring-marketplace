import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageCircleMore, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MessagesPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const recipientId = params.id ? parseInt(params.id, 10) : null;
  const [messageInput, setMessageInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  console.log("MessagesPage params:", params);
  console.log("MessagesPage recipientId:", recipientId);
  console.log("Current user data:", user);

  // Fetch recipient data if ID is provided
  const { data: recipientData, isLoading: isLoadingRecipient } = useQuery<any>({
    queryKey: [`/api/users/${recipientId}`],
    enabled: !!recipientId,
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!recipientId) throw new Error("No recipient selected");
      
      console.log("Sending message to recipient ID:", recipientId);
      console.log("Message content:", content);
      console.log("Current user ID:", user?.id);
      console.log("Current user role:", user?.role);
      
      try {
        // Validate that the user is logged in before even trying to send a message
        const checkUserResponse = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        console.log("Auth check status:", checkUserResponse.status);
        
        if (!checkUserResponse.ok) {
          console.error("Authentication check failed:", checkUserResponse.status);
          throw new Error("Authentication check failed - not logged in");
        }
        
        const userData = await checkUserResponse.json();
        console.log("Authenticated user data:", userData);
        
        // Now try to send the actual message
        const messageResponse = await fetch("/api/messages", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: recipientId,
            content,
          }),
        });
        
        console.log("Message send status:", messageResponse.status);
        
        if (!messageResponse.ok) {
          let errorMessage = "Failed to send message";
          
          try {
            const errorData = await messageResponse.json();
            console.error("Server error response:", errorData);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Failed to parse error response");
          }
          
          if (messageResponse.status === 401) {
            throw new Error("You need to be logged in to send messages. Please log in and try again.");
          } else if (messageResponse.status === 403) {
            throw new Error("You don't have permission to send messages. This feature may be restricted.");
          } else if (messageResponse.status === 404) {
            throw new Error("Could not find the recipient. They may no longer be available.");
          } else {
            throw new Error(errorMessage + ` (Status: ${messageResponse.status})`);
          }
        }
        
        const data = await messageResponse.json();
        console.log("Message send success response:", data);
        return data;
      } catch (error) {
        console.error("Error in message send process:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setMessageSent(true);
      setMessageInput("");
      
      // Show success toast
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      
      // Navigate back to previous page after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle message submission - just prevent default behavior
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission prevented, using direct button handler instead");
    // All messaging logic is now in the button onClick handler
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Please login to send messages</h2>
            <p className="text-gray-600">You need to be logged in to send messages.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>

          {!recipientId ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <MessageCircleMore className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No recipient selected</h3>
              <p className="text-gray-500">
                Please select a tutor or student to send a message to.
              </p>
            </div>
          ) : (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Send Message</CardTitle>
                <CardDescription>
                  Send a direct message that will be delivered to the recipient's inbox
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingRecipient ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recipientData ? (
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientData?.fullName || 'User'}`} />
                        <AvatarFallback>{(recipientData?.fullName || 'U').substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{recipientData?.fullName || 'User'}</h3>
                        <p className="text-sm text-gray-500">
                          {recipientData?.role === "student" ? "Student" : "Tutor"}
                        </p>
                      </div>
                    </div>
                    
                    {messageSent ? (
                      <Alert className="bg-green-50 border-green-200">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Message Sent Successfully!</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Your message has been sent to {recipientData?.fullName || 'the recipient'}. 
                          They will be notified and can respond when they log in.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            className="min-h-[150px]"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            disabled={sendMessageMutation.isPending}
                          />
                        </div>
                        <div>
                          <Button 
                            className="w-full mb-3"
                            disabled={!messageInput.trim() || sendMessageMutation.isPending}
                            onClick={async () => {
                              if (!messageInput.trim()) return;
                              
                              // Direct API call approach
                              try {
                                const response = await fetch("/api/messages", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json"
                                  },
                                  credentials: "include",
                                  body: JSON.stringify({
                                    receiverId: recipientId,
                                    content: messageInput.trim()
                                  })
                                });
                                
                                if (response.ok) {
                                  toast({
                                    title: "Message sent",
                                    description: "Your message has been sent successfully.",
                                  });
                                  setMessageSent(true);
                                  setMessageInput("");
                                  
                                  // Navigate back to previous page after a delay
                                  setTimeout(() => {
                                    navigate("/");
                                  }, 3000);
                                } else {
                                  const errorText = await response.text();
                                  toast({
                                    title: "Failed to send message",
                                    description: `Error: ${response.status} - ${errorText}`,
                                    variant: "destructive",
                                  });
                                }
                              } catch (error) {
                                toast({
                                  title: "Failed to send message",
                                  description: `Error: ${error}`,
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            {sendMessageMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.location.href = "/"}
                          >
                            Cancel
                          </Button>
                          
                          <p className="text-xs text-gray-500 text-center mt-2">
                            If you encounter any issues sending a message, please make sure you're logged in as a tutor.
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Could not find the user you're trying to message.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
