import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Search,
  Clock,
  Building
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
  thread_id: string;
}

interface Thread {
  id: string;
  property_id: string;
  property_title: string;
  participant_1: string;
  participant_2: string;
  participant_1_name: string;
  participant_2_name: string;
  last_message: string;
  last_message_time: string;
  created_at: string;
  messages?: Message[];
}

const Messages = () => {
  const { user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch threads for current user
  useEffect(() => {
    if (!user) return;
    
    fetchThreads();
  }, [user, fetchThreads]);

  // Fetch messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    
    fetchMessages(selectedThread);
  }, [selectedThread, fetchMessages]);

  const fetchThreads = useCallback(async () => {
    try {
      if (!supabase || !user) {
        setLoading(false);
        setThreads([]);
        return;
      }
      // First check if the messages table exists, if not, use sample data
      const { data: tableExists } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (!tableExists) {
        // Use sample data if table doesn't exist
        setThreads([
          {
            id: "1",
            property_id: "sample-property-1",
            property_title: "Modern Condo in Sukhumvit",
            participant_1: user!.id,
            participant_2: "sample-landlord-1",
            participant_1_name: user!.email || "You",
            participant_2_name: "Khun Somchai",
            last_message: "The viewing is confirmed for tomorrow at 2 PM",
            last_message_time: "2 hours ago",
            created_at: new Date().toISOString()
          },
          {
            id: "2", 
            property_id: "sample-property-2",
            property_title: "Cozy Studio in Thong Lo",
            participant_1: user!.id,
            participant_2: "sample-agent-1", 
            participant_1_name: user!.email || "You",
            participant_2_name: "Khun Malee",
            last_message: "I'll send you the lease documents",
            last_message_time: "1 day ago",
            created_at: new Date().toISOString()
          }
        ]);
        setLoading(false);
        return;
      }

      // If table exists, fetch real data
      const { data, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          properties(title)
        `)
        .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Map joined properties.title into property_title for UI usage
      const mapped = (data || []).map((t: Omit<Thread, 'property_title' | 'messages'> & { properties: { title: string } | null; }) => ({
        ...t,
        property_title: t.property_title ?? t.properties?.title ?? '',
      }));
      setThreads(mapped);
    } catch (error) {
      console.error('Error fetching threads:', error);
      // Fallback to sample data on error
      setThreads([
        {
          id: "1",
          property_id: "sample-property-1", 
          property_title: "Modern Condo in Sukhumvit",
          participant_1: user!.id,
          participant_2: "sample-landlord-1",
          participant_1_name: user!.email || "You",
          participant_2_name: "Khun Somchai", 
          last_message: "The viewing is confirmed for tomorrow at 2 PM",
          last_message_time: "2 hours ago",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (threadId: string) => {
    try {
      if (!supabase) return;
      // Check if messages table exists
      const { data: tableExists } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (!tableExists) {
        // Use sample messages if table doesn't exist
        const sampleMessages: Message[] = [
          {
            id: "1",
            content: "Hi, I'm interested in viewing this property",
            sender_id: user!.id,
            sender_name: user!.email || "You",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            thread_id: threadId
          },
          {
            id: "2",
            content: "Hello! Thank you for your interest. When would be convenient for you?",
            sender_id: "sample-landlord-1", 
            sender_name: "Khun Somchai",
            created_at: new Date(Date.now() - 43200000).toISOString(),
            thread_id: threadId
          }
        ];
        setMessages(sampleMessages);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  }, [user]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedThread || !user) return;
    
    try {
      if (!supabase) return;
      // Check if messages table exists
      const { data: tableExists } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (!tableExists) {
        // Simulate message sending for sample data
        const newMessage: Message = {
          id: Date.now().toString(),
          content: messageInput,
          sender_id: user.id,
          sender_name: user.email || "You",
          created_at: new Date().toISOString(), 
          thread_id: selectedThread
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput("");
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content: messageInput,
          sender_id: user.id,
          thread_id: selectedThread
        });

      if (error) throw error;

      setMessageInput("");
      fetchMessages(selectedThread);
      fetchThreads(); // Refresh threads to update last message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getOtherParticipantName(thread).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThreadData = threads.find(t => t.id === selectedThread);

  const getOtherParticipantName = (thread: Thread) => {
    return thread.participant_1 === user?.id ? thread.participant_2_name : thread.participant_1_name;
  };

  const getOtherParticipantId = (thread: Thread) => {
    return thread.participant_1 === user?.id ? thread.participant_2 : thread.participant_1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {filteredThreads.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
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
                        <AvatarFallback>
                          {getOtherParticipantName(thread).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {getOtherParticipantName(thread)}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {thread.property_title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {thread.last_message}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {thread.last_message_time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            {selectedThreadData ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {getOtherParticipantName(selectedThreadData).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {getOtherParticipantName(selectedThreadData)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {selectedThreadData.property_title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <div className="flex-1 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {new Date(message.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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