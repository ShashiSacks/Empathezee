import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Smile } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';

export function ChatBox() {
  const currentUserId = 'user-1'; // Mock ID
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'doc-1', text: 'Hello! I received your latest test results.', timestamp: '10:00 AM' },
    { id: '2', senderId: 'user-1', text: 'Great, are there any concerns?', timestamp: '10:05 AM' },
    { id: '3', senderId: 'doc-1', text: 'Everything looks perfectly normal. Keep up the good work with your diet.', timestamp: '10:08 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
  };

  return (
    <Card className="flex flex-col h-[600px] p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-secondary/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 relative">
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">Dr. Sarah Chen</h3>
            <p className="text-xs text-secondary-foreground/60">Online</p>
          </div>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><MoreVertical className="w-5 h-5 text-secondary-foreground/60" /></button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl",
                isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"
              )}>
                {msg.text}
              </div>
              <span className="text-[10px] text-secondary-foreground/40 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-secondary/10 border-t mt-auto">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-background border rounded-xl px-2 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <button type="button" className="p-2 text-secondary-foreground/40 hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-2"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="button" className="p-2 text-secondary-foreground/40 hover:text-primary transition-colors hidden sm:block"><Smile className="w-5 h-5" /></button>
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:bg-secondary disabled:text-secondary-foreground/40 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </Card>
  );
}
