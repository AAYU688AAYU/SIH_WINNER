
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, FileImage, AlertTriangle } from "lucide-react";

export default function ImageUpload({ onImageUpload }) {
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
            const file = files[0];
            if (file.type.startsWith("image/")) {
                onImageUpload(file);
            }
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            onImageUpload(files[0]);
        }
    };

    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Upload Fundus Image</CardTitle>
                <p className="text-slate-600">Upload a high-quality retinal image for AI analysis</p>
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
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <FileImage className="w-8 h-8 text-slate-400" />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Drop your fundus image here
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Or click to select from your device
                            </p>
                        </div>
                        
                        <Button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Select Image File
                        </Button>
                        
                        <p className="text-sm text-slate-500">
                            Supported formats: JPG, PNG, TIFF • Max size: 10MB
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800 mb-1">Image Quality Guidelines</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Use high-resolution fundus camera images</li>
                                <li>• Ensure proper illumination and focus</li>
                                <li>• Center the image on the macula region</li>
                                <li>• Avoid blurry or overexposed images</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
