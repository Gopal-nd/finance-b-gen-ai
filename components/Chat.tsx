'use client'
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client";
import { Textarea } from "./ui/textarea";

interface Message {
    id: number
    sender: string
    content: string
}
export default function FinanceAssistant() {
    const { data } = authClient.useSession();
    const user = data?.user;

    const greetingMessage = {
        role: "model",
        text: `Hi ${user?.name}! I'm your finance assistant. How can I help you today?`,
    };
        
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: `Hi ${user?.name}! I'm your finance assistant. How can I help you today?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        const historyToSend = [...messages, userMessage].filter(
            (msg) => msg.role === "user" || (msg.role === "model" && msg.text !== `Hi ${user?.name}! I'm your finance assistant. How can I help you today?`)
        );

        console.log(historyToSend)
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: historyToSend }),
            });

            const reader = res.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    result += decoder.decode(value);

                    const formatted = result

                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last?.role === "model") {
                            return [...prev.slice(0, -1), { ...last, text: formatted }];
                        } else {
                            return [...prev, { role: "model", text: formatted }];
                        }
                    });
                }
            }
        } catch (err) {
            console.error("Error in streaming response:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">💰 Finance Assistant</h1>
            <div className="space-y-2">
                {messages.map((msg, i) => (
                    <>
                     <ChatMessage key={i} content={msg.text} sender={msg.role} user={user} id={0} />
                     </>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Textarea
                    placeholder="Ask something about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={isLoading}>
                    {isLoading ? "Thinking..." : "Send"}
                </Button>
            </div>
        </div>
    );
}


const ChatMessage: React.FC<Message & { user: any }> = ({ sender:role, content:text, user }) => (
    <div className={`flex ${role === 'model' ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex items-end ${role === 'model' ? 'flex-row' : 'flex-row-reverse'}`}>
            <Avatar className="w-8 h-8">
                <AvatarImage src={role === 'model' ? "/model-avatar.png" :user?.image} />
                <AvatarFallback>{role[0]}</AvatarFallback>
            </Avatar>
            <div className={`mx-2 py-3 px-4 rounded-2xl ${role === 'model' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                 <div
                className="mt-1"
                dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
                />
            </div>
        </div>
    </div>
)
