import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { User as UserEntity } from "@/api/entities";

export default function PDFReport({ result, patientData, imageUrl }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [user, setUser] = useState(null);
    const [isDoctorOrAdmin, setIsDoctorOrAdmin] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await UserEntity.me();
                setUser(currentUser);
                setIsDoctorOrAdmin(currentUser.role === 'admin' || currentUser.role === 'doctor');
            } catch (error) {
                setUser(null);
                setIsDoctorOrAdmin(false);
            }
        };
        loadUser();
    }, []);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let currentY = 20;

            // Header with logo and title - No Report ID for patients
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('MINDHUE', 20, 25);
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text('AI-Powered Medical Analysis Platform', 20, 32);

            currentY = 50;

            // Only show generation date - NO Report ID
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            
            doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 20, currentY);
            
            currentY += 20;

            // Draw separator line
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(1);
            doc.line(20, currentY, pageWidth - 20, currentY);
            currentY += 15;

            // Patient Information Section
            doc.setFillColor(59, 130, 246);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.rect(20, currentY, pageWidth - 40, 8, 'F');
            doc.text('👤 Patient Information', 25, currentY + 6);
            currentY += 15;

            // Patient details in two columns
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            
            // Left column
            doc.text('FULL NAME', 25, currentY);
            doc.setFont(undefined, 'normal');
            doc.text(result.patient_name || 'N/A', 25, currentY + 6);
            
            // Right column
            doc.setFont(undefined, 'bold');
            doc.text('AGE', 120, currentY);
            doc.setFont(undefined, 'normal');
            doc.text(`${patientData?.age || 'N/A'} years`, 120, currentY + 6);
            
            currentY += 18;
            
            // Second row
            doc.setFont(undefined, 'bold');
            doc.text('GENDER', 25, currentY);
            doc.setFont(undefined, 'normal');
            doc.text(patientData?.gender || 'Not specified', 25, currentY + 6);
            
            doc.setFont(undefined, 'bold');
            doc.text('PHONE', 120, currentY);
            doc.setFont(undefined, 'normal');
            doc.text(patientData?.phone || 'Not provided', 120, currentY + 6);
            
            currentY += 18;

            // Medical History
            if (patientData?.medical_history) {
                doc.setFont(undefined, 'bold');
                doc.text('MEDICAL HISTORY', 25, currentY);
                doc.setFont(undefined, 'normal');
                const medicalHistoryLines = doc.splitTextToSize(patientData.medical_history, pageWidth - 50);
                doc.text(medicalHistoryLines, 25, currentY + 6);
                currentY += 6 + (medicalHistoryLines.length * 4) + 6;
            }

            // Current Symptoms
            if (patientData?.symptoms) {
                doc.setFont(undefined, 'bold');
                doc.text('CURRENT SYMPTOMS', 25, currentY);
                doc.setFont(undefined, 'normal');
                doc.text(patientData.symptoms, 25, currentY + 6);
                currentY += 18;
            }

            currentY += 5;

            // Analysis Results Section
            doc.setFillColor(16, 185, 129);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.rect(20, currentY, pageWidth - 40, 8, 'F');
            doc.text('📊 Analysis Results', 25, currentY + 6);
            currentY += 20;

            // Results in boxes
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(229, 231, 235);
            doc.setFillColor(249, 250, 251);
            
            // Three boxes for key metrics
            const boxWidth = (pageWidth - 60) / 3;
            const boxHeight = 25;
            
            // AI Confidence
            doc.rect(20, currentY, boxWidth, boxHeight, 'FD');
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text(`${Math.round(result.confidence_score || 85)}%`, 20 + boxWidth/2, currentY + 10, { align: 'center' });
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text('AI Confidence Score', 20 + boxWidth/2, currentY + 16, { align: 'center' });
            
            // Severity
            doc.rect(25 + boxWidth, currentY, boxWidth, boxHeight, 'FD');
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text((result.severity || 'MODERATE').toUpperCase(), 25 + boxWidth + boxWidth/2, currentY + 10, { align: 'center' });
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text('Severity Assessment', 25 + boxWidth + boxWidth/2, currentY + 16, { align: 'center' });
            
            // Analysis Type
            doc.rect(30 + boxWidth * 2, currentY, boxWidth, boxHeight, 'FD');
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('FUNDUS', 30 + boxWidth * 2 + boxWidth/2, currentY + 10, { align: 'center' });
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text('Analysis Type', 30 + boxWidth * 2 + boxWidth/2, currentY + 16, { align: 'center' });
            
            if (result.doctor_review_required) {
                doc.setFontSize(8);
                doc.setTextColor(245, 101, 101);
                doc.text('⚠ Review Required', 30 + boxWidth * 2 + boxWidth/2, currentY + 20, { align: 'center' });
                doc.setTextColor(0, 0, 0); // Reset color
            }

            currentY += boxHeight + 20;

            // Check if we need a new page
            if (currentY > pageHeight - 80) {
                doc.addPage();
                currentY = 20;
            }

            // Diagnosis Section
            if (result.diagnosis) {
                doc.setTextColor(0, 0, 0);
                doc.setFillColor(239, 246, 255);
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.rect(20, currentY, pageWidth - 40, 8, 'F');
                doc.text('🔍 Detailed Analysis', 25, currentY + 6);
                currentY += 20;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const diagnosisLines = doc.splitTextToSize(result.diagnosis, pageWidth - 50);
                doc.text(diagnosisLines, 25, currentY);
                currentY += diagnosisLines.length * 4 + 15;
            }

            // Recommendations Section
            if (result.recommendations) {
                // Check if we need a new page
                if (currentY > pageHeight - 60) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setFillColor(16, 185, 129);
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.rect(20, currentY, pageWidth - 40, 8, 'F');
                doc.text('💡 Recommendations', 25, currentY + 6);
                currentY += 20;

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const recommendationLines = doc.splitTextToSize(result.recommendations, pageWidth - 50);
                doc.text(recommendationLines, 25, currentY);
                currentY += recommendationLines.length * 4 + 15;
            }

            // Footer disclaimer
            if (currentY > pageHeight - 40) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFillColor(248, 250, 252);
            doc.rect(20, currentY, pageWidth - 40, 30, 'F');
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(8);
            doc.setFont(undefined, 'italic');
            const disclaimerText = 'DISCLAIMER: This report is generated by AI and is for informational purposes only. ' +
                'It should not replace professional medical diagnosis or treatment. Always consult with a qualified ' +
                'healthcare professional for proper medical advice and treatment decisions.';
            const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 50);
            doc.text(disclaimerLines, 25, currentY + 5);

            // Save the PDF with a clean filename
            const fileName = `Medical_Report_${result.patient_name?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                </>
            )}
        </Button>
    );
}