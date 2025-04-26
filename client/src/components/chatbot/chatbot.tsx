import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial welcome message when first opened
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hi there! I'm your TeacherOn assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom of messages
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when chat is opened
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const generateResponse = (userMessage: string): string => {
    // Simple response logic - in a real app this would call an AI API
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('hello') || userMessageLower.includes('hi')) {
      return "Hello! How can I assist you with tutoring today?";
    } else if (userMessageLower.includes('tutor')) {
      return "We have many qualified tutors available. You can browse them in the Tutors section or post a specific job to find the perfect match.";
    } else if (userMessageLower.includes('price') || userMessageLower.includes('cost') || userMessageLower.includes('fee')) {
      return "Tutors set their own hourly rates, which you can see on their profiles. Rates typically range from $20-$50 per hour depending on subject and experience level.";
    } else if (userMessageLower.includes('subject')) {
      return "We offer tutoring in a wide variety of subjects including Mathematics, Science, Languages, Programming, and more. Check out our Tutors page to filter by subject!";
    } else if (userMessageLower.includes('register') || userMessageLower.includes('sign up')) {
      return "You can register as either a student or tutor by clicking the 'Sign Up' button in the top right corner. The process only takes a few minutes!";
    } else if (userMessageLower.includes('payment') || userMessageLower.includes('pay')) {
      return "We handle payments securely through our platform. You only pay once you've found a tutor and agreed on the details of your tutoring arrangement.";
    } else if (userMessageLower.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about TeacherOn?";
    } else {
      return "I'd be happy to help with that. For more specific assistance, you might want to browse our FAQ page or contact our support team.";
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] shadow-lg flex flex-col">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-primary text-primary-foreground">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">TeacherOn Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:text-white hover:bg-primary/80"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start max-w-[80%]">
                      {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="https://ui-avatars.com/api/?name=Bot&background=4f46e5&color=fff" />
                          <AvatarFallback>Bot</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src="https://ui-avatars.com/api/?name=User&background=f59e0b&color=fff" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="https://ui-avatars.com/api/?name=Bot&background=4f46e5&color=fff" />
                        <AvatarFallback>Bot</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-center space-x-2">
              <Textarea
                ref={inputRef}
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-9 flex-grow resize-none"
                maxRows={3}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}
    </div>
  );
}