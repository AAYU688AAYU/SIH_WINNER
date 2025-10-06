import React, { useState, useEffect } from 'react';
import { Doctor } from '@/api/entities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash, PlusCircle } from 'lucide-react';
import { toast } from "sonner";

const DoctorForm = ({ doctor, onSave, onCancel }) => {
    const [formData, setFormData] = useState(doctor || {
        full_name: '',
        specialization: '',
        experience_years: 0,
        hospital_affiliation: '',
        consultation_fee: 0,
        contact_email: '',
        rating: 4.5,
        license_number: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input name="full_name" value={formData.full_name} onChange={handleChange} required /></div>
                <div><Label>Email</Label><Input name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required /></div>
                <div><Label>Specialization</Label><Input name="specialization" value={formData.specialization} onChange={handleChange} required /></div>
                <div><Label>License Number</Label><Input name="license_number" value={formData.license_number} onChange={handleChange} required /></div>
                <div><Label>Experience (Years)</Label><Input name="experience_years" type="number" value={formData.experience_years} onChange={handleChange} /></div>
                <div><Label>Affiliation</Label><Input name="hospital_affiliation" value={formData.hospital_affiliation} onChange={handleChange} /></div>
                <div><Label>Fee</Label><Input name="consultation_fee" type="number" value={formData.consultation_fee} onChange={handleChange} /></div>
                <div><Label>Rating</Label><Input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} /></div>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Doctor</Button>
            </div>
        </form>
    );
};

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const doctorList = await Doctor.list();
            setDoctors(doctorList);
        } catch (error) {
            toast.error("Failed to load doctors.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSave = async (data) => {
        try {
            if (editingDoctor) {
                await Doctor.update(editingDoctor.id, data);
                toast.success("Doctor updated successfully.");
            } else {
                await Doctor.create(data);
                toast.success("Doctor created successfully.");
            }
            setIsDialogOpen(false);
            setEditingDoctor(null);
            fetchDoctors();
        } catch (error) {
            toast.error("Failed to save doctor.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                await Doctor.delete(id);
                toast.success("Doctor deleted successfully.");
                fetchDoctors();
            } catch (error) {
                toast.error("Failed to delete doctor.");
            }
        }
    };

    if (loading) return <div>Loading doctors...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Doctor Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingDoctor(null)}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Add Doctor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
                        </DialogHeader>
                        <DoctorForm doctor={editingDoctor} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {doctors.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell>{doc.full_name}</TableCell>
                            <TableCell>{doc.specialization}</TableCell>
                            <TableCell>{doc.experience_years} years</TableCell>
                            <TableCell className="space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingDoctor(doc); setIsDialogOpen(true); }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
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