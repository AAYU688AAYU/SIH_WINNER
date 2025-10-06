import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    
    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();
    
    const isError = results && ((typeof results === 'string' && /error|failed/i.test(results)) || (parsedResults?.success === false));
    
    const statusConfig = {
        pending: { icon: Clock, color: 'text-slate-400', text: 'Pending' },
        running: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        in_progress: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        completed: isError ? 
            { icon: AlertCircle, color: 'text-red-500', text: 'Failed' } : 
            { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        success: { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        failed: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' },
        error: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' }
    }[status] || { icon: Zap, color: 'text-slate-500', text: '' };
    
    const Icon = statusConfig.icon;
    const formattedName = name.split('.').reverse().join(' ').toLowerCase().replace(/_/g, ' ');
    
    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all", "hover:bg-slate-50", expanded ? "bg-slate-50 border-slate-300" : "bg-white border-slate-200")}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-slate-700 capitalize">{formattedName}</span>
                {statusConfig.text && (<span className={cn("text-slate-500", isError && "text-red-600")}>• {statusConfig.text}</span>)}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (<ChevronRight className={cn("h-3 w-3 text-slate-400 transition-transform ml-auto", expanded && "rotate-90")} />)}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 space-y-2">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Parameters:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap">
                                {(() => { try { return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2); } catch { return toolCall.arguments_string; } })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Result:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap max-h-48 overflow-auto">
                                {typeof parsedResults === 'object' ? JSON.stringify(parsedResults, null, 2) : parsedResults}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const fileUrl = message.file_urls?.[0];

    return (
        <div className={cn("flex gap-3 my-4", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                 <Avatar className="w-10 h-10 border-2 border-blue-200 shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <Brain className="w-5 h-5" />
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                <div className={cn("rounded-2xl px-4 py-2.5", isUser ? "bg-blue-700 text-white" : "bg-white border border-slate-200")}>
                    {isUser ? (
                        <>
                            {fileUrl && (
                                <img src={fileUrl} alt="Uploaded content" className="rounded-lg mb-2 max-h-48" />
                            )}
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        </>
                    ) : (
                        <ReactMarkdown 
                            className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            components={{
                                code: ({ inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="relative group/code">
                                            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto my-2"><code className={className} {...props}>{children}</code></pre>
                                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 bg-slate-800 hover:bg-slate-700" onClick={() => { navigator.clipboard.writeText(String(children).replace(/\n$/, '')); toast.success('Code copied'); }}>
                                                <Copy className="h-3 w-3 text-slate-400" />
                                            </Button>
                                        </div>
                                    ) : ( <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{children}</code> );
                                },
                                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                            }}
                        >{message.content}</ReactMarkdown>
                    )}
                </div>
                
                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1 mt-2 w-full">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}
            </div>
            {isUser && (
                <Avatar className="w-10 h-10 border-2 border-slate-200 shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-slate-700 text-white font-semibold">U</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}