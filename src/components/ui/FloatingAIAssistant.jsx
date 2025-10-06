import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2, Brain, Sparkles } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { User } from "@/api/entities";

export default function FloatingAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: 'Hello! I\'m your MINDHUE AI medical assistant. I can help you with:\n\n• **Medical Questions** - Explain symptoms, conditions, and treatments\n• **Diagnosis Support** - Interpret medical results and images\n• **Platform Guidance** - Navigate MINDHUE features\n• **Specialist Referrals** - When to consult specific doctors\n\nHow can I assist you today?' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        User.me().then(setUser).catch(() => setUser(null));
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const prompt = `
                You are MINDHUE AI, an advanced medical AI assistant specializing in ophthalmology and retinal diseases.
                You help doctors, medical professionals, and patients understand:
                - Retinal conditions (AMD, DME, diabetic retinopathy, etc.)
                - Fundus image analysis results
                - ERG report interpretations
                - Treatment recommendations
                - When to seek specialist care
                - General medical questions
                
                User context: ${user ? `Medical professional - ${user.full_name} (${user.email})` : 'Healthcare user'}
                
                User question: "${input}"
                
                Provide a helpful, professional, and medically accurate response. Use clear language that's appropriate for medical professionals but also understandable for patients. Always recommend consulting with qualified healthcare providers for specific medical decisions.
                
                Format your response with proper structure using markdown formatting where helpful.
            `;

            const response = await InvokeLLM({ prompt });
            
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'I apologize, but I encountered a technical issue. Please try again or contact our support team if the problem persists.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-2xl medical-gradient hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 z-50 trust-shadow"
                size="icon"
            >
                <div className="relative">
                    <Brain className="w-7 h-7" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </Button>
        );
    }

    return (
        <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl border-0 transition-all duration-300 bg-white trust-shadow ${
            isMinimized ? 'w-80 h-20' : 'w-96 h-[500px]'
        }`}>
            <CardHeader className="flex flex-row items-center justify-between p-4 medical-gradient text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">MINDHUE AI Assistant</CardTitle>
                        <p className="text-xs opacity-90">Medical Support</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="w-8 h-8 text-white hover:bg-white/20 rounded-xl"
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 text-white hover:bg-white/20 rounded-xl"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            
            {!isMinimized && (
                <>
                    <CardContent className="flex-1 p-4 h-80 overflow-y-auto space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                        message.role === 'user'
                                            ? 'medical-gradient text-white'
                                            : 'bg-white text-gray-800 border border-gray-200'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                                            <Sparkles className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-semibold text-blue-600">MINDHUE AI</span>
                                        </div>
                                    )}
                                    <div className="whitespace-pre-wrap">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 p-3 rounded-2xl text-sm border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-600">MINDHUE AI</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <span className="text-xs text-gray-500">Analyzing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>
                    
                    <div className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-3">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me about medical diagnosis, symptoms, or platform help..."
                                className="flex-1 rounded-xl border-gray-300 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="medical-gradient hover:opacity-90 rounded-xl px-4"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {user ? `Logged in as ${user.full_name}` : 'Guest session'} • Always consult healthcare professionals
                        </p>
                    </div>
                </>
            )}
        </Card>
    );
}