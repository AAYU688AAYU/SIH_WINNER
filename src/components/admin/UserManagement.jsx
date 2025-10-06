import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, UserPlus, Shield, Users, Mail, Calendar, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentUser, setCurrentUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [userList, current] = await Promise.all([
                User.list(),
                User.me()
            ]);
            setUsers(userList);
            setFilteredUsers(userList);
            setCurrentUser(current);
        } catch (error) {
            toast.error("Failed to load users.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users;
        
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (roleFilter !== "all") {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        
        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await User.update(userId, { role: newRole });
            toast.success("User role updated successfully.");
            fetchUsers(); // Refresh the list
        } catch (error) {
            toast.error("Failed to update user role.");
            console.error(error);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200";
            case 'user':
                return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200";
            default:
                return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">Manage user roles and permissions</p>
                </div>
                
                {/* User Invitation Info */}
                <Alert className="max-w-md">
                    <UserPlus className="h-4 w-4" />
                    <AlertDescription className="text-sm text-slate-700 dark:text-slate-300">
                        <strong>How to add users:</strong> Share the app URL with new users. They'll be automatically registered when they sign in with Google.
                    </AlertDescription>
                </Alert>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{users.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Administrators</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 text-slate-900 dark:text-slate-100"
                                />
                            </div>
                        </div>
                        
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Administrators</SelectItem>
                                <SelectItem value="user">Regular Users</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setSearchTerm("");
                                setRoleFilter("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-slate-200 dark:border-slate-700">
                                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">User</TableHead>
                                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Email</TableHead>
                                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Role</TableHead>
                                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Joined</TableHead>
                                    <TableHead className="text-slate-900 dark:text-slate-100 font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map(user => (
                                    <TableRow key={user.id} className="border-b border-slate-100 dark:border-slate-700">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                                        {user.full_name?.charAt(0) || user.email?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</p>
                                                    {currentUser?.id === user.id && (
                                                        <Badge variant="outline" className="text-xs">You</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-700 dark:text-slate-300">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getRoleBadgeColor(user.role)} border font-medium`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {(user.role || 'user').toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(user.created_date).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={user.role || 'user'}
                                                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                                    disabled={currentUser?.id === user.id}
                                                >
                                                    <SelectTrigger className="w-32 h-8 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-3 h-3 text-red-600" />
                                                                Admin
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="user">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                                User
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Users Found</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        {searchTerm || roleFilter !== "all" 
                            ? "No users match your current filters." 
                            : "No users have signed up yet."
                        }
                    </p>
                </div>
            )}

            {/* Information Panel */}
            <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-slate-700 dark:text-slate-300">
                    <strong>Authentication System:</strong> MINDHUE uses secure Google SSO authentication. 
                    Users automatically get accounts when they first sign in with their Google account. 
                    You can manage their roles and permissions here. Only 'admin' and 'user' roles are supported.
                </AlertDescription>
            </Alert>
        </div>
    );
}