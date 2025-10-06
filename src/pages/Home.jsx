
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Brain, 
    Upload,
    FileText,
    Activity,
    Users,
    ArrowRight,
    User as UserIcon,
    TrendingUp,
    Shield,
    Zap,
    Eye,
    Stethoscope,
    CheckCircle,
    Calendar
} from "lucide-react";
import { User } from "@/api/entities";
import { DiagnosisReport } from "@/api/entities";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="trust-shadow border border-gray-200/60 hover:shadow-lg transition-all duration-300 bg-white">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                        {trend && (
                            <span className="text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {trend}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const ServiceCard = ({ title, description, icon: Icon, color, link, badge }) => (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200/60 group bg-white trust-shadow">
        <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                {badge && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
                        {badge}
                    </span>
                )}
            </div>
            <CardTitle className="text-xl font-bold text-gray-800 mb-3">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
            <Link to={link}>
                <Button className="w-full medical-gradient hover:opacity-90 text-white font-semibold rounded-xl py-3 shadow-md">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </CardContent>
    </Card>
);

export default function Home() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ reports: 0, patients: 0, critical: 0 });
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (e) { 
                setUser(null);
            }

            try {
                const reports = await DiagnosisReport.list('-created_date', 5);
                const allReports = await DiagnosisReport.list();
                const patientIds = new Set(allReports.map(r => r.patient_id));
                
                setRecentReports(reports);
                setStats({
                    reports: allReports.length,
                    patients: patientIds.size,
                    critical: allReports.filter(r => r.severity === 'critical').length
                });
            } catch (error) {
                console.error('Failed to load reports:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-8 trust-shadow">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            {getGreeting()}{user ? `, Dr. ${user.full_name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Your AI-powered medical diagnosis platform
                        </p>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-700">HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-700">AI-Powered Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                                <Users className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-purple-700">Trusted by 500+ Doctors</span>
                            </div>
                        </div>
                    </div>
                    <Link to={createPageUrl("Diagnosis")}>
                        <Button size="lg" className="medical-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4">
                            <Upload className="w-6 h-6 mr-3" />
                            Start New Analysis
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Analyses" 
                        value={stats.reports} 
                        icon={FileText} 
                        color="medical-gradient" 
                        trend={12}
                    />
                    <StatCard 
                        title="Unique Patients" 
                        value={stats.patients} 
                        icon={Users} 
                        color="bg-green-500" 
                        trend={8}
                    />
                    <StatCard 
                        title="Critical Cases" 
                        value={stats.critical} 
                        icon={Activity} 
                        color="bg-red-500" 
                    />
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Diagnostic Tools</h2>
                    <p className="text-lg text-gray-600">Choose your analysis type to get started with AI-powered diagnosis</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ServiceCard
                        title="Fundus Image Analysis"
                        description="Upload high-resolution fundus images for AI-powered detection of retinal diseases, macular disorders, and diabetic retinopathy with 95%+ accuracy."
                        icon={Eye}
                        color="medical-gradient"
                        link={createPageUrl("Diagnosis?type=fundus")}
                        badge="Most Popular"
                    />
                    <ServiceCard
                        title="ERG Report Analysis"
                        description="Analyze electroretinography reports to evaluate retinal function and detect electrical response abnormalities with advanced AI algorithms."
                        icon={Activity}
                        color="bg-green-500"
                        link={createPageUrl("Diagnosis?type=erg")}
                        badge="Advanced"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            {!loading && recentReports.length > 0 && (
                <Card className="border border-gray-200/60 trust-shadow bg-white">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-900">Recent Analyses</CardTitle>
                        <p className="text-gray-600">Your latest diagnostic reports and analyses</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {recentReports.map(report => (
                                <div key={report.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-md ${
                                            (report.analysis_type || 'fundus') === 'fundus' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {(report.analysis_type || 'fundus') === 'fundus' ? <Eye className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-lg">
                                                Report #{report.id ? report.id.slice(-6) : 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {(report.analysis_type || 'fundus') ? 
                                                    ((report.analysis_type || 'fundus').charAt(0).toUpperCase() + (report.analysis_type || 'fundus').slice(1)) : 'General'
                                                } Analysis • <span className="capitalize font-medium">{report.severity || 'Unknown'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(report.created_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(report.created_date).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Additional Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-gray-200/60 trust-shadow bg-white">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <Brain className="w-6 h-6 text-blue-600" />
                            AI Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Get instant medical insights and answers to your diagnostic questions with our advanced AI assistant powered by the latest medical knowledge.
                        </p>
                        <Link to={createPageUrl("Chat")}>
                            <Button className="w-full medical-gradient hover:opacity-90 text-white rounded-xl py-3 font-semibold">
                                Start Chat <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200/60 trust-shadow bg-white">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <Stethoscope className="w-6 h-6 text-green-600" />
                            Specialist Network
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Connect with qualified ophthalmologists and retinal specialists for comprehensive patient care and professional consultations.
                        </p>
                        <Link to={createPageUrl("Doctors")}>
                            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-semibold">
                                Find Specialists <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
