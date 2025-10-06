
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Brain, 
    Home, 
    Info, 
    Upload, 
    FileText, 
    Stethoscope, 
    MessageCircle, 
    LayoutDashboard,
    LogOut,
    User as UserIcon,
    Settings,
    Bell
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/api/entities";

import FloatingAIAssistant from "../components/ui/FloatingAIAssistant";

const navigationItems = [
    {
        title: "Dashboard",
        url: createPageUrl("Home"),
        icon: Home,
    },
    {
        title: "New Analysis",
        url: createPageUrl("Diagnosis"),
        icon: Upload,
    },
    {
        title: "Patient Reports",
        url: createPageUrl("Reports"),
        icon: FileText,
    },
    {
        title: "Find Specialists",
        url: createPageUrl("Doctors"),
        icon: Stethoscope,
    },
    {
        title: "AI Assistant",
        url: createPageUrl("Chat"),
        icon: MessageCircle,
    },
    {
        title: "Settings",
        url: createPageUrl("Settings"),
        icon: Settings,
    },
    {
        title: "About",
        url: createPageUrl("About"),
        icon: Info,
    },
];

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await UserEntity.me();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            }
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await UserEntity.logout();
        window.location.reload();
    };

    return (
        <SidebarProvider>
            <style>{`
                :root {
                    --background: 248 250 252;
                    --foreground: 15 23 42;
                    --card: 255 255 255;
                    --card-foreground: 15 23 42;
                    --popover: 255 255 255;
                    --popover-foreground: 15 23 42;
                    --primary: 14 165 233;
                    --primary-foreground: 255 255 255;
                    --secondary: 6 182 212;
                    --secondary-foreground: 255 255 255;
                    --muted: 241 245 249;
                    --muted-foreground: 71 85 105;
                    --accent: 239 246 255;
                    --accent-foreground: 15 23 42;
                    --destructive: 239 68 68;
                    --destructive-foreground: 255 255 255;
                    --border: 226 232 240;
                    --input: 255 255 255;
                    --ring: 14 165 233;
                    --radius: 12px;
                    --text-primary: 15 23 42;
                    --text-secondary: 51 65 85;
                    --text-muted: 100 116 139;
                }
                
                .dark {
                    --background: 2 6 23;
                    --foreground: 248 250 252;
                    --card: 15 23 42;
                    --card-foreground: 248 250 252;
                    --popover: 15 23 42;
                    --popover-foreground: 248 250 252;
                    --primary: 56 189 248;
                    --primary-foreground: 15 23 42;
                    --secondary: 34 211 238;
                    --secondary-foreground: 15 23 42;
                    --muted: 51 65 85;
                    --muted-foreground: 148 163 184;
                    --accent: 30 58 138;
                    --accent-foreground: 248 250 252;
                    --destructive: 239 68 68;
                    --destructive-foreground: 248 250 252;
                    --border: 51 65 85;
                    --input: 30 41 59;
                    --ring: 56 189 248;
                    --text-primary: 248 250 252;
                    --text-secondary: 203 213 225;
                    --text-muted: 148 163 184;
                }
                
                body {
                    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: rgb(var(--background));
                    color: rgb(var(--text-primary));
                    line-height: 1.6;
                }
                
                .medical-gradient {
                    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                }
                
                .trust-shadow {
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }

                /* High contrast text classes */
                .text-primary { color: rgb(var(--text-primary)); }
                .text-secondary { color: rgb(var(--text-secondary)); }
                .text-muted { color: rgb(var(--text-muted)); }
                
                /* Override any low contrast text */
                .text-slate-900 { color: rgb(15 23 42) !important; }
                .text-slate-800 { color: rgb(30 41 59) !important; }
                .text-slate-700 { color: rgb(51 65 85) !important; }
                .text-slate-600 { color: rgb(71 85 105) !important; }
                .text-slate-500 { color: rgb(100 116 139) !important; }
                
                .dark .text-slate-900 { color: rgb(248 250 252) !important; }
                .dark .text-slate-800 { color: rgb(226 232 240) !important; }
                .dark .text-slate-700 { color: rgb(203 213 225) !important; }
                .dark .text-slate-600 { color: rgb(148 163 184) !important; }
                .dark .text-slate-500 { color: rgb(148 163 184) !important; }

                /* Form inputs */
                input, textarea, select {
                    background-color: rgb(var(--input)) !important;
                    color: rgb(var(--text-primary)) !important;
                    border-color: rgb(var(--border)) !important;
                }

                input::placeholder, textarea::placeholder {
                    color: rgb(var(--text-muted)) !important;
                }
            `}</style>
            <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-900">
                <Sidebar className="border-r border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                    <SidebarHeader className="border-b border-gray-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 medical-gradient rounded-2xl flex items-center justify-center shadow-lg">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl tracking-tight">MINDHUE</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Medical AI Platform</p>
                            </div>
                        </div>
                    </SidebarHeader>
                    
                    <SidebarContent className="p-4 bg-white dark:bg-slate-800">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-3 py-3">
                                Navigation
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                asChild 
                                                className={`font-medium justify-start hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-xl py-3 px-4 ${
                                                    location.pathname === item.url 
                                                        ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-slate-600 font-semibold' 
                                                        : 'text-slate-700 dark:text-slate-300 hover:shadow-sm'
                                                }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {user?.role === 'admin' && (
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-3 py-3">
                                    Administration
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild className="font-medium justify-start text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-xl py-3 px-4">
                                                <Link to={createPageUrl("AdminDashboard")} className="flex items-center gap-3">
                                                    <LayoutDashboard className="w-5 h-5" />
                                                    <span>Admin Panel</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>

                    <SidebarFooter className="border-t border-gray-100 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
                        {user ? (
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{user.full_name}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleLogout}
                                    className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => UserEntity.login()} 
                                className="w-full medical-gradient hover:opacity-90 text-white font-semibold shadow-md rounded-xl py-3"
                            >
                                Sign In / Sign Up
                            </Button>
                        )}
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 flex flex-col min-h-screen">
                    <header className="flex items-center justify-between bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors duration-200 md:hidden" />
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentPageName}</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Powered by AI for better healthcare</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                                <Bell className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
                        {children}
                    </div>
                </main>
                
                <FloatingAIAssistant />
            </div>
        </SidebarProvider>
    );
}
