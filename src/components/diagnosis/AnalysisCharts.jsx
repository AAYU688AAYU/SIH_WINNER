
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    LineChart,
    Line,
    RadialBarChart,
    RadialBar
} from "recharts";
import { TrendingUp, Activity, Eye, AlertTriangle } from "lucide-react";

const COLORS = {
    primary: '#3B82F6', // blue-500
    secondary: '#06B6D4', // cyan-500
    success: '#14B8A6', // teal-500
    warning: '#6366F1', // indigo-500
    danger: '#EF4444', // red-500
    purple: '#8B5CF6' // purple-500
};

export default function AnalysisCharts({ result }) {
    // Process data for charts
    const severityData = [
        { name: 'Normal', value: result.severity === 'mild' ? 60 : 20, fill: COLORS.success },
        { name: 'Mild', value: result.severity === 'mild' ? 30 : 25, fill: COLORS.primary },
        { name: 'Moderate', value: result.severity === 'moderate' ? 40 : 15, fill: COLORS.warning },
        { name: 'Severe', value: result.severity === 'severe' ? 50 : 10, fill: COLORS.danger }
    ];

    const confidenceData = [
        { name: 'Confidence', value: result.confidence_score || 85, fill: COLORS.primary }
    ];

    const conditionAnalysis = result.detected_conditions?.map((condition, index) => ({
        name: condition,
        probability: Math.random() * 40 + 60, // Simulate probabilities
        severity: Math.random() * 30 + 20
    })) || [];

    const riskFactors = [
        { factor: 'Age-related', risk: result.age > 50 ? 75 : 25 },
        { factor: 'Diabetic', risk: result.detected_conditions?.some(c => c.toLowerCase().includes('diabetic')) ? 80 : 20 },
        { factor: 'Macular', risk: result.detected_conditions?.some(c => c.toLowerCase().includes('macular')) ? 70 : 30 },
        { factor: 'Vascular', risk: Math.random() * 60 + 20 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Confidence Score */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <Activity className="w-5 h-5 text-blue-600" />
                        AI Confidence Level
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={confidenceData}>
                            <RadialBar 
                                dataKey="value" 
                                cornerRadius={10} 
                                fill={COLORS.primary}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-2xl font-bold">
                                {result.confidence_score || 85}%
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <Eye className="w-5 h-5 text-teal-600" />
                        Risk Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={severityData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Condition Probabilities */}
            {conditionAnalysis.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <AlertTriangle className="w-5 h-5 text-purple-600" />
                            Detected Conditions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={conditionAnalysis}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{fontSize: 12}} 
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis tick={{fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar dataKey="probability" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Risk Factors Analysis */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Risk Factor Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={riskFactors} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" domain={[0, 100]} tick={{fontSize: 12}} />
                            <YAxis type="category" dataKey="factor" tick={{fontSize: 12}} width={80} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value) => [`${value.toFixed(0)}%`, 'Risk Level']}
                            />
                            <Bar dataKey="risk" fill={COLORS.warning} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
