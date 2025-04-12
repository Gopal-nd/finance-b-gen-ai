"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSendChatMessage } from "@/hooks/use-goals"

interface ChatMessage {
  id: string
  question: string
  response: string
  createdAt: string
}

interface GoalChatProps {
  goalId: string
  initialMessages: ChatMessage[]
  goalDetails: any
}

export function GoalChat({ goalId, initialMessages, goalDetails }: GoalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || [])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { mutate: sendMessage, isPending: isLoading } = useSendChatMessage(goalId)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    const userQuestion = newMessage.trim()
    setNewMessage("")

    // Create a temporary message
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      question: userQuestion,
      response: "",
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    // Send the message to the API
    sendMessage(userQuestion, {
      onError: () => {
        // Remove the temporary message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      },
    })
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ask questions specific to your {goalDetails.name} goal. Get personalized advice on investment strategies,
              risk assessment, or alternative approaches.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{message.question}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{formatDate(message.createdAt)}</span>
                    </div>
                  </div>

                  {(message.response || message.id.startsWith("temp-")) && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="bg-primary/10 p-3 rounded-md">
                          {message.response ? (
                            <p className="text-sm whitespace-pre-line">{message.response}</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                              <div
                                className="h-2 w-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="h-2 w-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          )}
                        </div>
                        {message.response && (
                          <span className="text-xs text-muted-foreground mt-1">{formatDate(message.createdAt)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about your goal..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Ask questions specific to this goal. For example: "How can I reach this goal faster?" or "What are the risks?"
        </p>
      </div>
    </div>
  )
}
