import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Calendar, FileText, Activity } from "lucide-react";

export default function PatientForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        full_name: "",
        age: "",
        gender: "",
        phone: "",
        medical_history: "",
        symptoms: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert symptoms array back to string for compatibility
        const submissionData = {
            ...formData,
            symptoms: formData.symptoms.join(', ')
        };
        onSubmit(submissionData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSymptomChange = (symptom, checked) => {
        setFormData(prev => ({
            ...prev,
            symptoms: checked 
                ? [...prev.symptoms, symptom]
                : prev.symptoms.filter(s => s !== symptom)
        }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 10) {
            handleChange("phone", value);
        }
    };

    const symptomOptions = [
        "Blurry or distorted vision",
        "Eye pain",
        "Irritation",
        "Redness",
        "Seeing floaters or flashes of light",
        "Difficulty with night vision",
        "Sensitivity to light",
        "Double vision",
        "Sudden or gradual loss of vision",
        "Excessive tearing or discharge from eye",
        "Headache",
        "Other symptoms"
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-xl">
                    <div className="w-20 h-20 medical-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900 mb-2">Patient Information</CardTitle>
                    <p className="text-slate-600 text-lg">Please provide patient details for accurate diagnosis</p>
                </CardHeader>
                
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Personal Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="full_name" className="text-sm font-semibold text-slate-900">
                                        Full Name *
                                    </Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => handleChange("full_name", e.target.value)}
                                        placeholder="Enter patient's full name"
                                        required
                                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <Label htmlFor="age" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        Age *
                                    </Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleChange("age", parseInt(e.target.value))}
                                        placeholder="Age in years"
                                        required
                                        min="1"
                                        max="120"
                                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="gender" className="text-sm font-semibold text-slate-900">
                                        Gender
                                    </Label>
                                    <Select onValueChange={(value) => handleChange("gender", value)}>
                                        <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white text-slate-900">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male" className="text-slate-900">Male</SelectItem>
                                            <SelectItem value="female" className="text-slate-900">Female</SelectItem>
                                            <SelectItem value="other" className="text-slate-900">Other</SelectItem>
                                            <SelectItem value="prefer_not_to_say" className="text-slate-900">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        Phone Number (10 digits)
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400"
                                    />
                                    {formData.phone && formData.phone.length !== 10 && (
                                        <p className="text-sm text-red-600">Phone number must be exactly 10 digits</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Medical Information Section */}
                        <div className="space-y-6 pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Medical History</h3>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="medical_history" className="text-sm font-semibold text-slate-900">
                                    Previous Medical Conditions
                                </Label>
                                <Textarea
                                    id="medical_history"
                                    value={formData.medical_history}
                                    onChange={(e) => handleChange("medical_history", e.target.value)}
                                    placeholder="Previous conditions, medications, surgeries, allergies..."
                                    rows={4}
                                    className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none bg-white text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Symptoms Section */}
                        <div className="space-y-6 pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-5 h-5 text-blue-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Current Symptoms</h3>
                                <p className="text-sm text-slate-600 ml-2">(Select all that apply)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {symptomOptions.map((symptom, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <Checkbox
                                            id={`symptom-${index}`}
                                            checked={formData.symptoms.includes(symptom)}
                                            onCheckedChange={(checked) => handleSymptomChange(symptom, checked)}
                                            className="text-blue-600"
                                        />
                                        <Label 
                                            htmlFor={`symptom-${index}`} 
                                            className="text-sm text-slate-900 cursor-pointer leading-relaxed"
                                        >
                                            {symptom}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            {formData.symptoms.includes("Other symptoms") && (
                                <div className="space-y-3 mt-4">
                                    <Label htmlFor="custom_symptoms" className="text-sm font-semibold text-slate-900">
                                        Describe Other Symptoms
                                    </Label>
                                    <Textarea
                                        id="custom_symptoms"
                                        placeholder="Please describe any other symptoms you're experiencing..."
                                        rows={3}
                                        className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg resize-none bg-white text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <Button 
                                type="submit" 
                                className="w-full medical-gradient hover:opacity-90 text-white py-4 text-lg font-semibold shadow-lg rounded-xl h-14 transition-all duration-200"
                            >
                                Continue to Image Upload
                            </Button>
                        </div>
                    </form>

                    {/* Privacy Notice */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <FileText className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-800 text-sm">Privacy & Security</h4>
                                <p className="text-blue-700 text-sm mt-1">
                                    All patient information is encrypted and stored securely in compliance with HIPAA regulations. 
                                    Your data is only used for medical analysis and is never shared with third parties.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}