'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Loader2
} from 'lucide-react'

const DISASTER_RESPONSES: Record<string, string[]> = {
  flood: [
    "During a flood, move to higher ground immediately. Avoid walking or driving through flood waters - just 6 inches of water can knock you down.",
    "If you're caught in rising water, call emergency services. If you must evacuate through water, use a stick to check the ground ahead of you.",
    "After a flood, avoid contact with floodwater as it may be contaminated. Don't return home until authorities say it's safe."
  ],
  earthquake: [
    "During an earthquake, DROP to your hands and knees, COVER your head and neck under sturdy furniture, and HOLD ON until shaking stops.",
    "If you're outside during an earthquake, move away from buildings, trees, streetlights, and utility wires. Drop to the ground until the shaking stops.",
    "After an earthquake, be prepared for aftershocks. Check yourself and others for injuries, and be careful of fallen debris."
  ],
  heatwave: [
    "During a heatwave, stay in air-conditioned spaces, drink plenty of water, and avoid strenuous activities during peak heat hours (10am-4pm).",
    "Check on elderly neighbors and those without air conditioning. Never leave children or pets in parked cars.",
    "Signs of heat stroke include hot, red skin, rapid pulse, and confusion. If someone shows these signs, call emergency services immediately."
  ],
  cyclone: [
    "When a cyclone warning is issued, secure loose items outside, stock emergency supplies, and know your evacuation routes.",
    "During a cyclone, stay indoors away from windows. If your home isn't safe, evacuate to a designated shelter.",
    "After the cyclone passes, be careful of fallen power lines and structural damage. Don't go outside until authorities confirm it's safe."
  ],
  general: [
    "For any disaster, have an emergency kit ready with water, food, medications, flashlight, and important documents.",
    "Create a family emergency plan including meeting points and emergency contacts.",
    "Sign up for local emergency alerts and follow instructions from authorities during any disaster situation.",
    "Keep your phone charged and have backup power sources available."
  ]
}

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('flood') || lowerQuery.includes('water') || lowerQuery.includes('rain')) {
    return DISASTER_RESPONSES.flood[Math.floor(Math.random() * DISASTER_RESPONSES.flood.length)]
  }
  if (lowerQuery.includes('earthquake') || lowerQuery.includes('quake') || lowerQuery.includes('tremor')) {
    return DISASTER_RESPONSES.earthquake[Math.floor(Math.random() * DISASTER_RESPONSES.earthquake.length)]
  }
  if (lowerQuery.includes('heat') || lowerQuery.includes('hot') || lowerQuery.includes('temperature')) {
    return DISASTER_RESPONSES.heatwave[Math.floor(Math.random() * DISASTER_RESPONSES.heatwave.length)]
  }
  if (lowerQuery.includes('cyclone') || lowerQuery.includes('storm') || lowerQuery.includes('wind') || lowerQuery.includes('hurricane')) {
    return DISASTER_RESPONSES.cyclone[Math.floor(Math.random() * DISASTER_RESPONSES.cyclone.length)]
  }
  if (lowerQuery.includes('help') || lowerQuery.includes('emergency') || lowerQuery.includes('what') || lowerQuery.includes('how')) {
    return DISASTER_RESPONSES.general[Math.floor(Math.random() * DISASTER_RESPONSES.general.length)]
  }
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return "Hello! I'm DisasterGuard AI Assistant. I can help you with disaster preparedness, emergency procedures, and safety tips. What would you like to know about?"
  }
  if (lowerQuery.includes('thank')) {
    return "You're welcome! Stay safe and prepared. Feel free to ask any other questions about disaster management."
  }
  
  return "I'm here to help with disaster preparedness and emergency guidance. You can ask me about floods, earthquakes, heatwaves, cyclones, or general emergency preparedness. How can I assist you today?"
}

interface ChatBubbleProps {
  message: ChatMessage
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3',
        isUser && 'flex-row-reverse'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-primary' : 'bg-accent'
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-accent-foreground" />
        )}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5',
        isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-secondary text-secondary-foreground rounded-tl-sm'
      )}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className={cn(
          'text-[10px] mt-1 block',
          isUser ? 'text-primary-foreground/60' : 'text-muted-foreground'
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  )
}

export function AIChatbot() {
  const { chatMessages, addChatMessage, clearChat } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
  
  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }
    
    addChatMessage(userMessage)
    setInput('')
    setIsTyping(true)
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const response = getAIResponse(userMessage.content)
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    }
    
    addChatMessage(assistantMessage)
    setIsTyping(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <>
      {/* Chat toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center glow-primary z-50"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              'fixed bottom-6 right-6 glass-card rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden',
              isExpanded ? 'w-[600px] h-[700px]' : 'w-[380px] h-[500px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">DisasterGuard AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearChat}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Ask me about disaster preparedness, emergency procedures, or safety tips.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Flood safety', 'Earthquake tips', 'Heatwave precautions'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(suggestion)
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is typing...</span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about disaster safety..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="icon"
                  className="gradient-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
