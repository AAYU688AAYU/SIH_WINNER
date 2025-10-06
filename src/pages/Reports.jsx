
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    FileText, 
    Search, 
    Filter, 
    Eye,
    Calendar,
    User,
    Download,
    ArrowRight,
    BarChart3,
    TrendingUp,
    Clock,
    AlertTriangle,
    Plus
} from "lucide-react";
import { DiagnosisReport } from "@/api/entities";
import { Patient } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const getSeverityColor = (severity) => {
    switch (severity) {
        case "mild": return "bg-cyan-100 text-cyan-800 border-cyan-200";
        case "moderate": return "bg-blue-100 text-blue-800 border-blue-200";
        case "severe": return "bg-indigo-100 text-indigo-800 border-indigo-200";
        case "critical": return "bg-red-100 text-red-800 border-red-200";
        default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
};

const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
    >
        <Card className={`${gradient} text-white shadow-lg border-0`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
                        <p className="text-2xl md:text-3xl font-bold">{value}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-full">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const ReportCardSkeleton = () => (
    <Card className="shadow-md border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-4 md:p-6">
            <div className="animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                            <div className="h-6 bg-slate-200 rounded w-16"></div>
                            <div className="h-6 bg-slate-200 rounded w-24"></div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="h-4 bg-slate-200 rounded w-32"></div>
                            <div className="h-4 bg-slate-200 rounded w-24"></div>
                        </div>

                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>

                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 bg-slate-200 rounded w-16"></div>
                            <div className="h-6 bg-slate-200 rounded w-20"></div>
                            <div className="h-6 bg-slate-200 rounded w-14"></div>
                        </div>
                    </div>

                    <div className="ml-4 space-y-2">
                        <div className="h-9 bg-slate-200 rounded w-24"></div>
                        <div className="h-6 bg-slate-200 rounded w-28"></div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [patients, setPatients] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const loadData = async () => {
        try {
            const [reportsData, patientsData] = await Promise.all([
                DiagnosisReport.list('-created_date'),
                Patient.list()
            ]);
            
            setReports(reportsData);
            setPatients(patientsData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load reports:", error);
            setLoading(false);
        }
    };

    const filterReports = useCallback(() => {
        let filtered = reports;

        if (searchTerm) {
            filtered = filtered.filter(report => {
                const patient = patients.find(p => p.id === report.patient_id);
                return patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        if (severityFilter !== "all") {
            filtered = filtered.filter(report => report.severity === severityFilter);
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(report => report.status === statusFilter);
        }

        setFilteredReports(filtered);
    }, [reports, patients, searchTerm, severityFilter, statusFilter]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterReports();
    }, [filterReports]);

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient?.full_name || "Unknown Patient";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-slate-600">Loading diagnostic reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                Diagnostic Reports
                            </h1>
                            <p className="text-slate-600">
                                View and manage all AI-generated retinal analysis reports
                            </p>
                        </div>
                        <Link to={createPageUrl("Diagnosis")} className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-md">
                                <Plus className="w-4 h-4 mr-2" />
                                New Analysis
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                        <StatCard 
                            title="Total Reports" 
                            value={reports.length} 
                            icon={FileText} 
                            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                            delay={0.1}
                        />
                        <StatCard 
                            title="Normal/Mild" 
                            value={reports.filter(r => r.severity === 'mild').length} 
                            icon={TrendingUp} 
                            gradient="bg-gradient-to-r from-green-500 to-cyan-600"
                            delay={0.2}
                        />
                        <StatCard 
                            title="Moderate/Severe" 
                            value={reports.filter(r => ['moderate', 'severe'].includes(r.severity)).length} 
                            icon={AlertTriangle} 
                            gradient="bg-gradient-to-r from-amber-500 to-orange-600"
                            delay={0.3}
                        />
                        <StatCard 
                            title="Unique Patients" 
                            value={patients.length} 
                            icon={User} 
                            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                            delay={0.4}
                        />
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6 shadow-md border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search by patient name or diagnosis..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 border-slate-200 focus:border-blue-500 text-slate-900"
                                        />
                                    </div>
                                </div>
                                
                                <Button 
                                    variant="outline" 
                                    className="sm:hidden text-slate-700"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                            
                            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isFilterOpen ? 'block' : 'hidden sm:grid'}`}>
                                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                    <SelectTrigger className="text-slate-700">
                                        <SelectValue placeholder="Filter by severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Severities</SelectItem>
                                        <SelectItem value="mild">Mild</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="severe">Severe</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="text-slate-700">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="reviewed">Reviewed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <div className="flex items-center justify-end lg:justify-start">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSeverityFilter("all");
                                            setStatusFilter("all");
                                        }}
                                        className="text-slate-600 hover:text-slate-800"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        Showing {filteredReports.length} of {reports.length} reports
                    </p>
                    <div className="text-xs text-slate-500">
                        Sorted by: Most Recent
                    </div>
                </div>

                {/* Reports List */}
                <div className="space-y-3 md:space-y-4">
                    {filteredReports.length === 0 ? (
                        <Card className="shadow-md border-0 text-center py-8 md:py-12">
                            <CardContent>
                                <FileText className="w-12 h-12 md:w-16 md:h-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">No Reports Found</h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    {reports.length === 0 
                                        ? "No diagnostic reports have been generated yet. Start by creating your first analysis."
                                        : "No reports match your current filters. Try adjusting your search criteria."
                                    }
                                </p>
                                <Link to={createPageUrl("Diagnosis")}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start New Analysis
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <AnimatePresence>
                            {filteredReports.map((report, index) => (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    layout
                                >
                                    <Card className="shadow-md border-0 hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm overflow-hidden">
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                        <h3 className="text-base md:text-lg font-semibold text-slate-900 truncate">
                                                            {getPatientName(report.patient_id)}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <Badge 
                                                                className={`${getSeverityColor(report.severity)} border`}
                                                            >
                                                                {(report.severity || 'N/A').toUpperCase()}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                                                {Math.round(report.confidence_score || 85)}% Confidence
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(report.created_date)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            ID: {report.id?.slice(-8)}
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-700 mb-4 line-clamp-2 text-sm md:text-base">
                                                        {report.diagnosis?.substring(0, 200)}...
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {report.detected_conditions?.slice(0, 3).map((condition, i) => (
                                                            <Badge 
                                                                key={i} 
                                                                variant="secondary" 
                                                                className="bg-blue-50 text-blue-700 text-xs border-blue-200"
                                                            >
                                                                {condition}
                                                            </Badge>
                                                        ))}
                                                        {report.detected_conditions?.length > 3 && (
                                                            <Badge 
                                                                variant="secondary" 
                                                                className="bg-slate-100 text-slate-600 text-xs border-slate-200"
                                                            >
                                                                +{report.detected_conditions.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 md:items-end">
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
                                                        onClick={() => {
                                                            // View detailed report functionality
                                                            console.log("View report:", report.id);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                    
                                                    {report.doctor_review_required && (
                                                        <Badge className="bg-blue-100 text-blue-800 text-xs border-blue-200 self-start md:self-auto">
                                                            Doctor Review Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
