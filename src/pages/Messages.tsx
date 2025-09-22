import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Search,
  Clock,
  Building
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isOwnMessage: boolean;
}

interface Thread {
  id: string;
  propertyTitle: string;
  otherParticipant: {
    name: string;
    role: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const Messages = () => {
  const [selectedThread, setSelectedThread] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock threads data
  const [threads] = useState<Thread[]>([
    {
      id: "1",
      propertyTitle: "Modern Condo in Sukhumvit",
      otherParticipant: {
        name: "Khun Somchai",
        role: "Landlord",
        avatar: "/placeholder.svg"
      },
      lastMessage: "The viewing is confirmed for tomorrow at 2 PM",
      lastMessageTime: "2 hours ago",
      unreadCount: 2,
      messages: [
        {
          id: "1",
          content: "Hi, I'm interested in viewing this property",
          senderId: "me",
          senderName: "You",
          timestamp: "Yesterday 3:30 PM",
          isOwnMessage: true
        },
        {
          id: "2", 
          content: "Hello! Thank you for your interest. When would be convenient for you?",
          senderId: "landlord1",
          senderName: "Khun Somchai",
          timestamp: "Yesterday 4:15 PM",
          isOwnMessage: false
        },
        {
          id: "3",
          content: "Tomorrow afternoon would work well for me",
          senderId: "me",
          senderName: "You", 
          timestamp: "Today 9:20 AM",
          isOwnMessage: true
        },
        {
          id: "4",
          content: "The viewing is confirmed for tomorrow at 2 PM",
          senderId: "landlord1",
          senderName: "Khun Somchai",
          timestamp: "2 hours ago",
          isOwnMessage: false
        }
      ]
    },
    {
      id: "2",
      propertyTitle: "Cozy Studio in Thong Lo",
      otherParticipant: {
        name: "Khun Malee", 
        role: "Agent",
        avatar: "/placeholder.svg"
      },
      lastMessage: "I'll send you the lease documents",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      messages: [
        {
          id: "1",
          content: "Is this property still available?",
          senderId: "me",
          senderName: "You",
          timestamp: "2 days ago",
          isOwnMessage: true
        },
        {
          id: "2",
          content: "Yes, it's available! Would you like to proceed with the application?",
          senderId: "agent1", 
          senderName: "Khun Malee",
          timestamp: "2 days ago",
          isOwnMessage: false
        },
        {
          id: "3",
          content: "Yes, I'd like to apply. What documents do you need?",
          senderId: "me",
          senderName: "You",
          timestamp: "1 day ago", 
          isOwnMessage: true
        },
        {
          id: "4",
          content: "I'll send you the lease documents",
          senderId: "agent1",
          senderName: "Khun Malee",
          timestamp: "1 day ago",
          isOwnMessage: false
        }
      ]
    }
  ]);

  const filteredThreads = threads.filter(thread =>
    thread.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThreadData = threads.find(t => t.id === selectedThread);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In real app, this would send message via API
    console.log(`Sending message: ${messageInput}`);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Communicate with landlords and agents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Threads List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedThread === thread.id 
                      ? 'bg-accent border-2 border-primary/20' 
                      : 'hover:bg-accent/50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={thread.otherParticipant.avatar} />
                      <AvatarFallback>
                        {thread.otherParticipant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {thread.otherParticipant.name}
                        </h4>
                        {thread.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {thread.propertyTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {thread.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            {selectedThreadData ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedThreadData.otherParticipant.avatar} />
                      <AvatarFallback>
                        {selectedThreadData.otherParticipant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedThreadData.otherParticipant.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {selectedThreadData.propertyTitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <div className="flex-1 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {selectedThreadData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwnMessage 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;