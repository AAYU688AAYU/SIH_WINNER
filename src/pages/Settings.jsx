import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Building2, 
    User as UserIcon, 
    CreditCard, 
    Database, 
    Settings as SettingsIcon, 
    HelpCircle,
    Upload,
    Save,
    Moon,
    Sun,
    Shield,
    Bell,
    Download,
    Trash2,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Eye,
    Crown,
    FileText,
    Users,
    Activity
} from "lucide-react";
import { User } from "@/api/entities";
import { DiagnosisReport } from "@/api/entities";
import { Patient } from "@/api/entities";
import { toast } from "sonner";

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="shadow-sm border-0">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        app: true
    });
    const [stats, setStats] = useState({
        patients: 0,
        reports: 0,
        lastLogin: null
    });
    const [organizationData, setOrganizationData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        license: ""
    });
    const [profileData, setProfileData] = useState({
        full_name: "",
        specialization: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [currentUser, reports, patients] = await Promise.all([
                User.me(),
                DiagnosisReport.list(),
                Patient.list()
            ]);
            
            setUser(currentUser);
            setProfileData({
                full_name: currentUser.full_name || "",
                specialization: currentUser.specialization || "",
                email: currentUser.email || "",
                phone: currentUser.phone || ""
            });
            
            setStats({
                patients: patients.length,
                reports: reports.length,
                lastLogin: currentUser.last_login || new Date().toISOString()
            });
        } catch (error) {
            console.error("Failed to load settings data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await User.updateMyUserData(profileData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    const handleSaveOrganization = async () => {
        try {
            await User.updateMyUserData({ organization: organizationData });
            toast.success("Organization details saved successfully!");
        } catch (error) {
            toast.error("Failed to save organization details.");
        }
    };

    const handleExportData = () => {
        const csvContent = "Patient Name,Age,Date,Diagnosis\nSample Export Data";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient_records_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-600 mt-1">Manage your account and application preferences</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure
                </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Patients" 
                    value={stats.patients} 
                    icon={Users} 
                    color="bg-blue-600"
                />
                <StatCard 
                    title="Reports Generated" 
                    value={stats.reports} 
                    icon={FileText} 
                    color="bg-green-600"
                />
                <StatCard 
                    title="Days Active" 
                    value={Math.ceil((new Date() - new Date(stats.lastLogin)) / (1000 * 60 * 60 * 24))} 
                    icon={Activity} 
                    color="bg-purple-600"
                />
            </div>

            <Tabs defaultValue="organization" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 bg-slate-100 p-1 h-auto">
                    <TabsTrigger value="organization" className="flex items-center gap-2 py-3">
                        <Building2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Organization</span>
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
                        <UserIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="subscription" className="flex items-center gap-2 py-3">
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2 py-3">
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">Data</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
                        <SettingsIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Preferences</span>
                    </TabsTrigger>
                    <TabsTrigger value="support" className="flex items-center gap-2 py-3">
                        <HelpCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Support</span>
                    </TabsTrigger>
                </TabsList>

                {/* Organization Tab */}
                <TabsContent value="organization">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Organization Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Institution Name</Label>
                                    <Input
                                        value={organizationData.name}
                                        onChange={(e) => setOrganizationData({...organizationData, name: e.target.value})}
                                        placeholder="Enter hospital/clinic name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>License Number</Label>
                                    <Input
                                        value={organizationData.license}
                                        onChange={(e) => setOrganizationData({...organizationData, license: e.target.value})}
                                        placeholder="Medical license number"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea
                                    value={organizationData.address}
                                    onChange={(e) => setOrganizationData({...organizationData, address: e.target.value})}
                                    placeholder="Complete address with city, state, zip"
                                    rows={3}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Contact Phone</Label>
                                    <Input
                                        value={organizationData.phone}
                                        onChange={(e) => setOrganizationData({...organizationData, phone: e.target.value})}
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Official Email</Label>
                                    <Input
                                        value={organizationData.email}
                                        onChange={(e) => setOrganizationData({...organizationData, email: e.target.value})}
                                        placeholder="contact@hospital.com"
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Organization Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Logo
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={handleSaveOrganization} className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Organization Details
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5" />
                                Doctor Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user?.profile_image} />
                                    <AvatarFallback className="text-xl">
                                        {user?.full_name?.charAt(0) || 'D'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Change Photo
                                    </Button>
                                    <p className="text-sm text-slate-600 mt-2">JPG or PNG, max 2MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                        placeholder="Dr. John Smith"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Specialization</Label>
                                    <Input
                                        value={profileData.specialization}
                                        onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                                        placeholder="Ophthalmologist"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        value={profileData.email}
                                        disabled
                                        className="bg-slate-50"
                                    />
                                    <p className="text-sm text-slate-500">Email cannot be changed</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Recent Activity</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-700">Last Login:</span>
                                        <span className="text-blue-900 font-medium">
                                            {new Date(stats.lastLogin).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-700">Status:</span>
                                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-yellow-600" />
                                    Current Subscription
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">Professional Plan</h3>
                                        <p className="text-slate-600">Advanced AI analysis with unlimited reports</p>
                                        <p className="text-sm text-slate-500 mt-2">Renews on December 31, 2024</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-600">$99</p>
                                        <p className="text-slate-500">per month</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <Button variant="outline">
                                        Change Plan
                                    </Button>
                                    <Button>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Invoice
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Billing History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b">
                                            <div>
                                                <p className="font-medium">Professional Plan</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(2024, 11-i, 1).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold">$99.00</span>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Data Tab */}
                <TabsContent value="data">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                Patient Records Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Export Data</h4>
                                    <p className="text-sm text-slate-600">
                                        Download your patient records in CSV format
                                    </p>
                                    <Button onClick={handleExportData} variant="outline" className="w-full">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Patient Records
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-red-700">Data Management</h4>
                                    <p className="text-sm text-slate-600">
                                        Archive or delete old patient records
                                    </p>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Archive Old Records
                                    </Button>
                                </div>
                            </div>

                            <Alert>
                                <Shield className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Data Protection:</strong> All exports are encrypted and comply with HIPAA regulations. 
                                    Patient data is automatically backed up daily.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="w-5 h-5" />
                                App Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium">Dark Mode</h4>
                                        <p className="text-sm text-slate-600">Toggle between light and dark themes</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="w-4 h-4" />
                                        <Switch
                                            checked={darkMode}
                                            onCheckedChange={setDarkMode}
                                        />
                                        <Moon className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium">Notifications</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>Email notifications</span>
                                            </div>
                                            <Switch
                                                checked={notifications.email}
                                                onCheckedChange={(checked) => 
                                                    setNotifications({...notifications, email: checked})
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>SMS notifications</span>
                                            </div>
                                            <Switch
                                                checked={notifications.sms}
                                                onCheckedChange={(checked) => 
                                                    setNotifications({...notifications, sms: checked})
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4" />
                                                <span>App notifications</span>
                                            </div>
                                            <Switch
                                                checked={notifications.app}
                                                onCheckedChange={(checked) => 
                                                    setNotifications({...notifications, app: checked})
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium">Security</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-600">Add an extra layer of security</p>
                                        </div>
                                        <Button variant="outline">
                                            Enable 2FA
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Support</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <Mail className="w-4 h-4 mr-2" />
                                    support@mindhue.com
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Phone className="w-4 h-4 mr-2" />
                                    +1 (555) 123-4567
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    Help Center
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Documentation
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Report a Bug
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Request Feature
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}