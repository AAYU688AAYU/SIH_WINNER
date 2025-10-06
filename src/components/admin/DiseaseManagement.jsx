import React, { useState, useEffect } from 'react';
import { DiseaseInfo } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash, PlusCircle } from 'lucide-react';
import { toast } from "sonner";

const DiseaseForm = ({ disease, onSave, onCancel }) => {
    const [formData, setFormData] = useState(disease || {
        name: '',
        description: '',
        precaution: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
            <div><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} required /></div>
            <div><Label>Precaution</Label><Textarea name="precaution" value={formData.precaution} onChange={handleChange} required /></div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Disease</Button>
            </div>
        </form>
    );
};

export default function DiseaseManagement() {
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDisease, setEditingDisease] = useState(null);

    const fetchDiseases = async () => {
        setLoading(true);
        try {
            const diseaseList = await DiseaseInfo.list();
            setDiseases(diseaseList);
        } catch (error) {
            toast.error("Failed to load diseases.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiseases();
    }, []);

    const handleSave = async (data) => {
        try {
            if (editingDisease) {
                await DiseaseInfo.update(editingDisease.id, data);
                toast.success("Disease updated successfully.");
            } else {
                await DiseaseInfo.create(data);
                toast.success("Disease created successfully.");
            }
            setIsDialogOpen(false);
            setEditingDisease(null);
            fetchDiseases();
        } catch (error) {
            toast.error("Failed to save disease.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this disease entry?")) {
            try {
                await DiseaseInfo.delete(id);
                toast.success("Disease deleted successfully.");
                fetchDiseases();
            } catch (error) {
                toast.error("Failed to delete disease.");
            }
        }
    };

    if (loading) return <div>Loading diseases...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Disease Information Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingDisease(null)}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Add Disease
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingDisease ? 'Edit Disease' : 'Add New Disease'}</DialogTitle>
                        </DialogHeader>
                        <DiseaseForm disease={editingDisease} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {diseases.map(dis => (
                        <TableRow key={dis.id}>
                            <TableCell>{dis.name}</TableCell>
                            <TableCell className="max-w-md truncate">{dis.description}</TableCell>
                            <TableCell className="space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingDisease(dis); setIsDialogOpen(true); }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(dis.id)}>
                                    <Trash className="w-4 h-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}