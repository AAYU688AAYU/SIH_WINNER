import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    Eye, 
    AlertCircle, 
    Loader2,
    Activity,
    Brain,
    Microscope,
    CheckCircle
} from "lucide-react";
import { Patient } from "@/api/entities";
import { DiagnosisReport } from "@/api/entities";
import { DiseaseInfo } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { User as UserEntity } from "@/api/entities";

import ImageUpload from "../components/diagnosis/ImageUpload";
import ErgUpload from "../components/diagnosis/ErgUpload";
import PatientForm from "../components/diagnosis/PatientForm";
import DiagnosisResults from "../components/diagnosis/DiagnosisResults";
import { mlRetinalAnalysis } from "@/api/functions";

export default function Diagnosis() {
    const [currentStep, setCurrentStep] = useState(1);
    const [analysisType, setAnalysisType] = useState('fundus');
    const [patientData, setPatientData] = useState({});
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [error, setError] = useState(null);
    const [useMLModel, setUseMLModel] = useState(true); // Toggle for ML vs LLM analysis

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        if (type === 'erg') {
            setAnalysisType('erg');
        } else {
            setAnalysisType('fundus');
        }
    }, []);

    const handlePatientSubmit = (data) => {
        setPatientData(data);
        setCurrentStep(2);
        setError(null);
    };

    const handleFileUpload = async (file) => {
        try {
            setError(null);
            const { file_url } = await UploadFile({ file });
            setUploadedFile(file);
            setFileUrl(file_url);
            setCurrentStep(3);
        } catch (error) {
            setError("Failed to upload file. Please try again.");
        }
    };

    const performDiagnosis = async () => {
        if (!fileUrl) return;

        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setError(null);

        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => Math.min(prev + 8, 90));
        }, 300);

        try {
            const patient = await Patient.create(patientData);
            
            let analysisResult;
            let reportData;

            if (analysisType === 'fundus' && useMLModel) {
                // Use ML Model for fundus images
                setAnalysisProgress(30);
                
                const mlResponse = await mlRetinalAnalysis({
                    imageUrl: fileUrl,
                    patientData: patientData
                });

                if (!mlResponse.data.success) {
                    throw new Error(mlResponse.data.error || 'ML analysis failed');
                }

                const mlResult = mlResponse.data;
                setAnalysisProgress(70);

                reportData = {
                    patient_id: patient.id,
                    analysis_type: analysisType,
                    fundus_image_url: fileUrl,
                    diagnosis: `**ML Model Prediction: ${mlResult.prediction.disease}**\n\n${mlResult.prediction.description}`,
                    confidence_score: mlResult.prediction.confidence_score,
                    detected_conditions: mlResult.detected_conditions,
                    severity: mlResult.prediction.severity,
                    recommendations: mlResult.recommendations,
                    doctor_review_required: mlResult.prediction.severity !== 'mild',
                    detailed_findings: mlResult.detailed_findings
                };

            } else {
                // Use LLM Analysis (original method)
                setAnalysisProgress(30);
                
                const diseaseInfos = await DiseaseInfo.list();
                const diseaseNames = diseaseInfos.map(d => d.name);
                
                const prompt = `You are an expert ophthalmologist AI. Your task is to analyze the provided ${analysisType === 'erg' ? 'ERG report' : 'fundus image'} and classify it into one of the following categories: ${diseaseNames.join(', ')}.

                Patient Context:
                - Name: ${patientData.full_name}
                - Age: ${patientData.age}
                - Gender: ${patientData.gender || 'Not specified'}
                - Medical History: ${patientData.medical_history || 'No significant history provided'}
                - Current Symptoms: ${patientData.symptoms || 'No specific symptoms reported'}

                Based on the ${analysisType === 'erg' ? 'ERG data' : 'fundus image'}, provide:
                1. The most likely disease classification from the provided list.
                2. A confidence score for your classification (0-100).
                3. A detailed clinical analysis and justification for your choice.`;

                const llmResult = await InvokeLLM({
                    prompt,
                    file_urls: [fileUrl],
                    response_json_schema: {
                        type: "object",
                        properties: {
                            disease_name: { type: "string", "enum": diseaseNames },
                            confidence_score: { type: "number" },
                            justification: { type: "string" }
                        },
                        required: ["disease_name", "confidence_score", "justification"]
                    }
                });

                setAnalysisProgress(70);

                const classifiedDiseaseName = llmResult.disease_name.toLowerCase();
                const matchedDisease = diseaseInfos.find(d => d.name.toLowerCase() === classifiedDiseaseName);

                if (!matchedDisease) {
                    throw new Error(`AI returned an unknown disease: ${llmResult.disease_name}`);
                }

                let severity = 'moderate';
                if (classifiedDiseaseName === 'normal fundus') severity = 'mild';
                if (['glaucoma', 'ARMD', 'diabetic retinopathy'].includes(classifiedDiseaseName)) severity = 'severe';
                if (llmResult.confidence_score < 70) severity = 'mild';

                reportData = {
                    patient_id: patient.id,
                    analysis_type: analysisType,
                    diagnosis: `**LLM Prediction: ${matchedDisease.name}**\n\n${matchedDisease.description}`,
                    confidence_score: llmResult.confidence_score || 85,
                    detected_conditions: [matchedDisease.name],
                    severity: severity,
                    recommendations: matchedDisease.precaution,
                    doctor_review_required: severity !== 'mild',
                    detailed_findings: llmResult.justification
                };

                if (analysisType === 'fundus') {
                    reportData.fundus_image_url = fileUrl;
                } else {
                    reportData.erg_report_url = fileUrl;
                }
            }

            clearInterval(progressInterval);
            setAnalysisProgress(100);
            
            const report = await DiagnosisReport.create(reportData);

            setDiagnosisResult({
                ...reportData,
                patient_name: patientData.full_name,
                report_id: report.id,
                analysis_method: useMLModel && analysisType === 'fundus' ? 'ML Model' : 'LLM Analysis'
            });

            setCurrentStep(4);

        } catch (err) {
            clearInterval(progressInterval);
            setError(`Analysis failed: ${err.message}. Please check the file format or try again.`);
            console.error("Diagnosis error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetDiagnosis = () => {
        setCurrentStep(1);
        setPatientData({});
        setUploadedFile(null);
        setFileUrl(null);
        setDiagnosisResult(null);
        setError(null);
        setAnalysisProgress(0);
    };

    const renderUploadStep = () => {
        if (analysisType === 'erg') {
            return <ErgUpload onFileUpload={handleFileUpload} />;
        }
        return <ImageUpload onImageUpload={handleFileUpload} />;
    };
    
    const renderAnalysisPreview = () => {
        if (analysisType === 'fundus' && fileUrl) {
            return (
                <div className="text-center space-y-4">
                    <img src={fileUrl} alt="Fundus" className="max-w-md mx-auto rounded-lg shadow-lg" />
                    
                    {/* Analysis Method Toggle */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Analysis Method:</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={useMLModel ? "default" : "outline"}
                                size="sm"
                                onClick={() => setUseMLModel(true)}
                                className="flex items-center gap-2"
                            >
                                <Brain className="w-4 h-4" />
                                ML Model
                                {useMLModel && <Badge className="ml-1 bg-green-100 text-green-700">Recommended</Badge>}
                            </Button>
                            <Button
                                variant={!useMLModel ? "default" : "outline"}
                                size="sm"
                                onClick={() => setUseMLModel(false)}
                                className="flex items-center gap-2"
                            >
                                <Microscope className="w-4 h-4" />
                                LLM Analysis
                            </Button>
                        </div>
                    </div>
                    
                    <div className="text-sm text-slate-600">
                        {useMLModel ? (
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                                <CheckCircle className="w-4 h-4" />
                                Using specialized CNN model trained on retinal images
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-purple-600">
                                <Brain className="w-4 h-4" />
                                Using advanced language model for analysis
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        if (analysisType === 'erg' && uploadedFile) {
            return (
                <div className="text-center p-8 bg-slate-100 rounded-lg">
                    <Activity className="w-12 h-12 mx-auto text-teal-600 mb-4" />
                    <p className="font-semibold text-slate-800">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-600">ERG report ready for analysis.</p>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    New {analysisType === 'erg' ? 'ERG Report' : 'Fundus Image'} Analysis
                </h1>
                <p className="text-lg text-slate-600">
                    Follow the steps below to get an AI-powered diagnostic report.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="transition-all duration-500 ease-in-out">
                {currentStep === 1 && <PatientForm onSubmit={handlePatientSubmit} />}
                {currentStep === 2 && renderUploadStep()}
                {currentStep === 3 && (
                    <Card className="shadow-lg border-slate-200/60">
                        <CardHeader>
                            <CardTitle className="text-center text-xl font-bold text-slate-900">
                                Ready for Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                {renderAnalysisPreview()}
                                <p className="text-slate-600 mt-4">
                                    Patient: <span className="font-semibold">{patientData.full_name}</span>
                                </p>
                            </div>

                            {isAnalyzing && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-blue-600">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="font-medium">
                                            {useMLModel && analysisType === 'fundus' ? 
                                                'ML model is analyzing the fundus image...' : 
                                                'AI is processing the data...'
                                            }
                                        </span>
                                    </div>
                                    <Progress value={analysisProgress} className="h-2" />
                                </div>
                            )}

                            <div className="flex justify-center gap-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setCurrentStep(2)}
                                    disabled={isAnalyzing}
                                >
                                    Change File
                                </Button>
                                <Button 
                                    onClick={performDiagnosis}
                                    disabled={isAnalyzing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><Eye className="w-4 h-4 mr-2" /> Start Analysis</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {currentStep === 4 && diagnosisResult && (
                    <DiagnosisResults 
                        result={diagnosisResult}
                        imageUrl={analysisType === 'fundus' ? fileUrl : null}
                        patientData={patientData}
                        onNewDiagnosis={resetDiagnosis}
                    />
                )}
            </div>
        </div>
    );
}