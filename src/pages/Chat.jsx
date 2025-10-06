import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User as UserIcon, Loader2, Brain, Sparkles, MessageSquare, ChevronRight } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import ReactMarkdown from 'react-markdown';
import { User } from "@/api/entities";

const AIMessage = ({ text, isStreaming }) => (
    <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-10 h-10 border-2 border-blue-200 shadow-sm flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Brain className="w-5 h-5" />
            </AvatarFallback>
        </Avatar>
        <div className="bg-white rounded-2xl rounded-tl-none p-4 w-full shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">MINDHUE AI</span>
            </div>
            {isStreaming ? (
                 <div className="flex items-center gap-3 py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-600">Analyzing your question...</span>
                </div>
            ) : (
                <ReactMarkdown className="prose prose-sm max-w-none text-slate-800">{text}</ReactMarkdown>
            )}
        </div>
    </div>
);

const UserMessage = ({ text, userName }) => (
    <div className="flex items-start gap-4 justify-end mb-6">
        <div className="bg-blue-700 text-white rounded-2xl rounded-tr-none p-4 max-w-2xl shadow-md">
            <p className="text-sm leading-relaxed">{text}</p>
        </div>
        <Avatar className="w-10 h-10 border-2 border-slate-200 shadow-sm flex-shrink-0">
             <AvatarFallback className="bg-slate-700 text-white font-semibold">
                {userName ? userName.charAt(0) : <UserIcon className="w-5 h-5" />}
            </AvatarFallback>
        </Avatar>
    </div>
);

const SuggestedQuestionCard = ({ question, onSelect }) => (
    <button
        onClick={() => onSelect(question)}
        className="w-full text-left p-4 bg-white rounded-xl shadow-sm border border-slate-200/80 hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 group flex items-center justify-between"
    >
        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{question}</span>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
    </button>
);


export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);

    const initialSuggestions = [
        "What are the signs of diabetic retinopathy?",
        "How do I interpret ERG results?",
        "When should I refer a patient to a specialist?",
        "What's the difference between AMD and diabetic macular edema?",
    ];

    useEffect(() => {
        User.me().then(setUser).catch(() => setUser(null));
        setMessages([
            { 
                sender: 'ai', 
                text: `Hello! I'm your MINDHUE AI medical assistant, specialized in ophthalmology and retinal diseases. How can I assist you today?` 
            }
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (question = null) => {
        const messageText = question || input.trim();
        if (!messageText || isLoading) return;

        const newMessages = [...messages, { sender: 'user', text: messageText }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const prompt = `You are MINDHUE AI, a specialized medical AI assistant focused on ophthalmology and retinal diseases. User context: ${user ? `Medical professional - ${user.full_name} (${user.email})` : 'Healthcare professional (not logged in)'}. User question: "${messageText}". Provide a comprehensive, medically accurate response formatted in markdown.`;
            const response = await InvokeLLM({ prompt });
            setMessages(prev => [...prev, { sender: 'ai', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: 'I apologize, but I encountered a technical issue. Please try again or contact our support team if the problem persists.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
            <Card className="flex-1 flex flex-col shadow-xl border-gray-200/80 rounded-2xl bg-slate-50/70 overflow-hidden">
                <CardHeader className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 medical-gradient rounded-xl flex items-center justify-center shadow-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">
                                MINDHUE AI Assistant
                            </CardTitle>
                            <p className="text-sm text-slate-600">
                                Specialized in Ophthalmology & Retinal Analysis
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
                     {messages.length <= 1 && !isLoading && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Suggested Questions:</h3>
                            {initialSuggestions.map((q, i) => (
                                <SuggestedQuestionCard key={i} question={q} onSelect={handleSend} />
                            ))}
                        </div>
                    )}
                    
                    {messages.map((msg, index) => 
                        msg.sender === 'ai' 
                            ? <AIMessage key={index} text={msg.text} /> 
                            : <UserMessage key={index} text={msg.text} userName={user?.full_name} />
                    )}
                    
                    {isLoading && <AIMessage isStreaming={true} />}
                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200/80">
                    <div className="flex gap-3 items-center">
                        <div className="flex-1 relative">
                            <Input 
                                placeholder="Ask a question about a diagnosis or treatment..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="pr-12 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2 rounded-xl text-slate-900"
                            />
                            <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                        <Button 
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="h-12 w-12 flex-shrink-0 bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm disabled:bg-slate-300"
                            size="icon"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}