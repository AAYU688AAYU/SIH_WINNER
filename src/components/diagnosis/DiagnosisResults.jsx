
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    CheckCircle2, 
    AlertTriangle, 
    AlertCircle, 
    Eye, 
    FileText, 
    Stethoscope,
    Download,
    RefreshCw,
    BarChart3,
    Activity,
    TrendingUp,
    Calendar,
    User,
    Clock,
    Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { User as UserEntity } from "@/api/entities";

import AnalysisCharts from "./AnalysisCharts";
import PDFReport from "./PDFReport";

const getSeverityColor = (severity) => {
    switch (severity) {
        case "mild": return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "moderate": return "bg-blue-100 text-blue-800 border-blue-200";
        case "severe": return "bg-amber-100 text-amber-800 border-amber-200";
        case "critical": return "bg-red-100 text-red-800 border-red-200";
        default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
};

const getSeverityIcon = (severity) => {
    switch (severity) {
        case "mild": return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        case "moderate": return <AlertTriangle className="w-5 h-5 text-blue-600" />;
        case "severe": return <AlertCircle className="w-5 h-5 text-amber-600" />;
        case "critical": return <AlertCircle className="w-5 h-5 text-red-600" />;
        default: return <Eye className="w-5 h-5 text-slate-600" />;
    }
};

export default function DiagnosisResults({ result, imageUrl, onNewDiagnosis, patientData }) {
    const [user, setUser] = useState(null);
    const [isDoctorOrAdmin, setIsDoctorOrAdmin] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await UserEntity.me();
                setUser(currentUser);
                // Check if user is admin or has doctor role
                setIsDoctorOrAdmin(currentUser.role === 'admin' || currentUser.role === 'doctor');
            } catch (error) {
                console.error("Failed to load user:", error);
                setUser(null);
                setIsDoctorOrAdmin(false);
            }
        };
        loadUser();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        Analysis Complete
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Medical Report Generated
                    </h1>
                    <p className="text-lg text-slate-600 mb-6">
                        AI-powered analysis for {result.patient_name}
                    </p>
                </motion.div>

                {/* Key Results Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-4 mb-8"
                >
                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                {Math.round(result.confidence_score || 85)}%
                            </div>
                            <p className="text-slate-600 font-medium">AI Confidence</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                {getSeverityIcon(result.severity)}
                            </div>
                            <Badge className={`text-lg px-4 py-2 ${getSeverityColor(result.severity)} border font-semibold`}>
                                {(result.severity || 'Unknown').toUpperCase()}
                            </Badge>
                            <p className="text-slate-600 font-medium mt-2">Severity Level</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-teal-600" />
                            </div>
                            <div className="text-lg font-bold text-slate-900 mb-1">
                                {new Date().toLocaleDateString()}
                            </div>
                            <p className="text-slate-600 font-medium">Report Date</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border-0 h-14">
                        <TabsTrigger value="overview" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                            <Eye className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="diagnosis" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                            <FileText className="w-4 h-4" />
                            Full Report
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                            <Stethoscope className="w-4 h-4" />
                            Treatment
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Patient & Image */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="shadow-lg border-0 overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                                        <CardTitle className="flex items-center gap-2 text-slate-900">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Patient Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 font-medium">Name</p>
                                                <p className="text-slate-900 font-semibold">{result.patient_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-medium">Age</p>
                                                <p className="text-slate-900 font-semibold">{patientData?.age || 'N/A'} years</p>
                                            </div>
                                            {/* Only show Report ID to doctors/admins */}
                                            {isDoctorOrAdmin && (
                                                <div className="col-span-2">
                                                    <p className="text-slate-500 font-medium">Report ID</p>
                                                    <p className="text-slate-900 font-mono text-xs">{result.report_id}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-slate-500 font-medium">Analysis Type</p>
                                                <p className="text-slate-900 font-semibold capitalize">Fundus Image</p>
                                            </div>
                                        </div>
                                        
                                        {imageUrl && (
                                            <div className="mt-6">
                                                <p className="text-slate-500 font-medium mb-3">Analyzed Image</p>
                                                <div className="relative group">
                                                    <img 
                                                        src={imageUrl} 
                                                        alt="Fundus Analysis" 
                                                        className="w-full h-64 object-cover rounded-lg shadow-md"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg"></div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Quick Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="space-y-6"
                            >
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-r from-slate-50 to-teal-50 border-b">
                                        <CardTitle className="flex items-center gap-2 text-slate-900">
                                            <Activity className="w-5 h-5 text-teal-600" />
                                            Analysis Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {result.detected_conditions && result.detected_conditions.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-slate-700 mb-3">Detected Conditions</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.detected_conditions.map((condition, index) => (
                                                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1 font-medium">
                                                                {condition}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="font-semibold text-slate-700 mb-3">Key Findings</h4>
                                                <div className="bg-slate-50 rounded-lg p-4">
                                                    <p className="text-slate-700 leading-relaxed">
                                                        {result.diagnosis?.split('\n')[0] || 'Analysis completed successfully.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-lg border-0">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-slate-700">Quick Actions</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <PDFReport 
                                                result={result} 
                                                patientData={patientData} 
                                                imageUrl={imageUrl} 
                                            />
                                            <Link to={createPageUrl("Doctors")} className="w-full">
                                                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                                                    <Stethoscope className="w-4 h-4 mr-2" />
                                                    Find Specialist
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </TabsContent>

                    {/* Full Report Tab */}
                    <TabsContent value="diagnosis" className="mt-6 space-y-6">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-slate-900">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Complete Diagnosis Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                                        {result.diagnosis || 'No detailed diagnosis available.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {result.detailed_findings && (
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-teal-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-slate-900">
                                        <Activity className="w-5 h-5 text-teal-600" />
                                        Detailed Clinical Findings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="prose max-w-none">
                                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                                            {result.detailed_findings}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="mt-6">
                        <AnalysisCharts result={{...result, age: patientData?.age}} />
                    </TabsContent>

                    {/* Recommendations Tab */}
                    <TabsContent value="recommendations" className="mt-6 space-y-6">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 border-b">
                                <CardTitle className="flex items-center gap-2 text-slate-900">
                                    <Stethoscope className="w-5 h-5 text-teal-600" />
                                    Clinical Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                                        {result.recommendations || 'Please consult with a qualified healthcare professional for personalized treatment recommendations.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {result.doctor_review_required && (
                            <Alert className="bg-blue-50 border-blue-200 shadow-md">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <AlertDescription className="text-blue-800 text-base leading-relaxed">
                                    <strong>Professional Review Recommended:</strong> Based on the AI analysis results, we recommend consulting with a qualified ophthalmologist for comprehensive evaluation and personalized treatment planning. This ensures the best possible care and treatment outcomes.
                                </AlertDescription>
                            </Alert>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-slate-200"
                >
                    <Link to={createPageUrl("Reports")}>
                        <Button variant="outline" className="w-full sm:w-auto border-slate-300 hover:border-blue-300 px-6 py-3 shadow-md">
                            <FileText className="w-4 h-4 mr-2" />
                            View All Reports
                        </Button>
                    </Link>
                    
                    <Button 
                        onClick={onNewDiagnosis}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-3 shadow-md"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Analysis
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
