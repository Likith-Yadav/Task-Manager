'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Knowledge base for the assistant
const knowledgeBase = {
  features: [
    'Task Management - Create, organize, and track tasks efficiently',
    'Project Organization - Group tasks into projects',
    'Priority Levels - Set task priorities (low, medium, high)',
    'Due Dates - Set and track task deadlines',
    'Categories - Organize tasks with custom categories',
    'Team Collaboration - Share and assign tasks to team members',
    'Progress Tracking - Monitor task and project completion',
  ],
  pricing: [
    'Free Tier - Basic task management for individuals',
    'Pro Plan ($10/month) - Advanced features for professionals',
    'Team Plan ($25/month) - Collaboration features for small teams',
    'Enterprise - Custom pricing for large organizations',
  ],
  faq: {
    'How do I create a task?': 'Click the "Create New Task" button in the dashboard, fill in the task details, and click Save.',
    'Can I share tasks?': 'Yes, Team and Enterprise plan users can share and assign tasks to team members.',
    'How do I change my password?': 'Go to Settings, scroll to the "Change Password" section, enter your current and new password.',
    'Is my data secure?': 'Yes, we use bank-grade encryption and follow industry best practices for data security.',
  }
};

export function AiAssistant() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your TaskFlow assistant. I can help you with features, pricing, account settings, and how to use the platform. What would you like to know?"
    }
  ]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for feature-related questions
    if (lowerQuery.includes('feature') || lowerQuery.includes('what can') || lowerQuery.includes('capabilities')) {
      return `TaskFlow offers several powerful features:\n${knowledgeBase.features.join('\n')}`;
    }
    
    // Check for pricing questions
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('plan')) {
      return `Here are our pricing plans:\n${knowledgeBase.pricing.join('\n')}`;
    }
    
    // Check for specific FAQ questions
    for (const [question, answer] of Object.entries(knowledgeBase.faq)) {
      if (lowerQuery.includes(question.toLowerCase())) {
        return answer;
      }
    }
    
    // Check for task-related questions
    if (lowerQuery.includes('task')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('add')) {
        return knowledgeBase.faq['How do I create a task?'];
      }
      if (lowerQuery.includes('share') || lowerQuery.includes('assign')) {
        return knowledgeBase.faq['Can I share tasks?'];
      }
    }
    
    // Check for security questions
    if (lowerQuery.includes('secure') || lowerQuery.includes('security') || lowerQuery.includes('privacy')) {
      return knowledgeBase.faq['Is my data secure?'];
    }
    
    // Check for password-related questions
    if (lowerQuery.includes('password')) {
      return knowledgeBase.faq['How do I change my password?'];
    }

    // Default response for unknown queries
    return "I understand you're asking about " + query + ". While I'm not sure about the specific details, I can help you with features, pricing, account settings, and general platform usage. Could you please rephrase your question or ask about one of these topics?";
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Generate response based on the query
    const response = generateResponse(message);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed right-4 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-xl transition-all duration-300 ease-in-out ${
        isMinimized ? 'bottom-4 h-14 w-72' : 'bottom-4 h-[600px] w-[400px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`font-semibold ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>AI Assistant</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? 
              <Maximize2 className="h-4 w-4" /> : 
              <Minimize2 className="h-4 w-4" />
            }
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : isDark 
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className={`border-t p-4 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..."
                className={`flex-1 ${
                  isDark 
                    ? 'bg-gray-700 text-gray-100 border-gray-600'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
} 