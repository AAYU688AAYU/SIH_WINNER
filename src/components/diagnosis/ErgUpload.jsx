
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Activity, FileText, AlertTriangle } from "lucide-react";

export default function ErgUpload({ onFileUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            onFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            onFileUpload(files[0]);
        }
    };

    return (
        <Card className="shadow-lg border-slate-200/60">
            <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Upload ERG Report</CardTitle>
                <p className="text-slate-600">Upload an ERG data file for AI analysis</p>
            </CardHeader>
            <CardContent>
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        dragActive 
                            ? "border-blue-400 bg-blue-50" 
                            : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv, .txt, .json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Drop your ERG report file here
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Or click to select from your device
                            </p>
                        </div>
                        
                        <Button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Select Report File
                        </Button>
                        
                        <p className="text-sm text-slate-500">
                            Supported formats: CSV, TXT, JSON
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800 mb-1">Data Guidelines</h4>
                            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                                <li>Ensure data is well-structured (e.g., proper columns in CSV).</li>
                                <li>Include headers for clarity if possible.</li>
                                <li>The file should contain waveform data (amplitude, time).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
