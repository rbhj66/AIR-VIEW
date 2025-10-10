'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { chat } from '@/ai/flows/chat';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
};

const ChatTrigger = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
    size="icon"
  >
    <MessageSquare size={28} />
  </Button>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: 'system',
      content:
        "Hello! I'm your AirView assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: nanoid(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Filter out system messages for the history sent to the model
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .map(({ role, content }) => ({ role, content }));
      
      const response = await chat({ history, message: input });
      
      const modelMessage: Message = { id: nanoid(), role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: nanoid(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : name[0];
  };
  
  return (
    <>
      <ChatTrigger onClick={() => setIsOpen(true)} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>AI Assistant</SheetTitle>
            <SheetDescription>
              Ask me anything about your air quality or device.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 pr-4 -mr-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3 text-sm',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role !== 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted',
                      message.role === 'system' && 'bg-transparent text-muted-foreground text-center w-full'
                    )}
                  >
                    <p className="leading-normal">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || userAvatar?.imageUrl} />
                        <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 text-sm">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter>
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                disabled={isLoading}
              >
                <Send size={16} />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
