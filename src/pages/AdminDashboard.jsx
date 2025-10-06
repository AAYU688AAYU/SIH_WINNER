import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Stethoscope, Bug, BarChart3 } from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import DoctorManagement from '@/components/admin/DoctorManagement';
import DiseaseManagement from '@/components/admin/DiseaseManagement';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-1">Manage users, data, and application settings.</p>
                </header>

                <AdminStats />

                <Card className="mt-8 shadow-md border-0">
                    <Tabs defaultValue="users" className="w-full">
                        <CardHeader className="p-0 border-b">
                            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 h-auto">
                                <TabsTrigger value="users" className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Users
                                </TabsTrigger>
                                <TabsTrigger value="doctors" className="flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" /> Doctors
                                </TabsTrigger>
                                <TabsTrigger value="diseases" className="flex items-center gap-2">
                                    <Bug className="w-4 h-4" /> Diseases
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Reports
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className="p-6">
                            <TabsContent value="users">
                                <UserManagement />
                            </TabsContent>
                            <TabsContent value="doctors">
                                <DoctorManagement />
                            </TabsContent>
                            <TabsContent value="diseases">
                                <DiseaseManagement />
                            </TabsContent>
                            <TabsContent value="reports">
                                <p className="text-center text-slate-500">Report management coming soon.</p>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}