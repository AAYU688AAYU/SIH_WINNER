import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
    Search, 
    Filter, 
    Star, 
    MapPin, 
    Award, 
    MessageSquare, 
    Phone,
    Mail,
    Calendar,
    Clock,
    Shield,
    Plus,
    DollarSign,
    CheckCircle,
    UserPlus,
    Eye,
    ThumbsUp
} from "lucide-react";
import { Doctor } from "@/api/entities";
import { User } from "@/api/entities";
import { toast } from "sonner";

const DoctorCard = ({ doctor, onBookAppointment, onViewProfile, onRateDoctor, currentUser }) => {
    const isOnline = Math.random() > 0.3; // Simulate online status
    const reviewCount = Math.floor(Math.random() * 100) + 10;

    return (
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-700 shadow-lg">
                                    <AvatarImage src={doctor.profile_image || `https://avatar.vercel.sh/${doctor.full_name}.png`} />
                                    <AvatarFallback className="text-lg font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                                        {doctor.full_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {doctor.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{doctor.full_name}</h3>
                                    {doctor.top_specialist && (
                                        <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1">
                                            ⭐ Top Specialist
                                        </Badge>
                                    )}
                                </div>
                                <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">{doctor.specialization}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {doctor.qualifications || "MBBS, MD Ophthalmology"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                                    {doctor.rating?.toFixed(1) || '4.8'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">({reviewCount} reviews)</p>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span>{doctor.hospital_affiliation || 'Global Healthcare'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Award className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span>{doctor.experience_years || '10+'} years experience</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span>{doctor.contact_phone || '+1 (555) 000-0000'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span className="truncate">{doctor.contact_email || 'doctor@hospital.com'}</span>
                            </div>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {isOnline ? 'Available Now' : 'By Appointment'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                    ${doctor.consultation_fee || '150'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button 
                            onClick={() => onBookAppointment(doctor)}
                            className="flex-1 medical-gradient hover:opacity-90 text-white font-semibold shadow-md"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => onViewProfile(doctor)}
                            className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                        </Button>
                        {currentUser && (
                            <Button 
                                variant="ghost" 
                                onClick={() => onRateDoctor(doctor)}
                                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Rate
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AddDoctorDialog = ({ isOpen, onClose, onSubmit, currentUser }) => {
    const [doctorData, setDoctorData] = useState({
        full_name: "",
        specialization: "",
        qualifications: "",
        license_number: "",
        experience_years: "",
        hospital_affiliation: "",
        consultation_fee: "",
        contact_email: "",
        contact_phone: "",
        profile_image: "",
        bio: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(doctorData);
        setDoctorData({
            full_name: "",
            specialization: "",
            qualifications: "",
            license_number: "",
            experience_years: "",
            hospital_affiliation: "",
            consultation_fee: "",
            contact_email: "",
            contact_phone: "",
            profile_image: "",
            bio: ""
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-slate-100">Add New Specialist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Full Name *</Label>
                            <Input
                                value={doctorData.full_name}
                                onChange={(e) => setDoctorData({...doctorData, full_name: e.target.value})}
                                placeholder="Dr. John Smith"
                                required
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Specialization *</Label>
                            <Select onValueChange={(value) => setDoctorData({...doctorData, specialization: value})}>
                                <SelectTrigger className="text-slate-900 dark:text-slate-100">
                                    <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Retina Specialist">Retina Specialist</SelectItem>
                                    <SelectItem value="Glaucoma Expert">Glaucoma Expert</SelectItem>
                                    <SelectItem value="Cataract Surgeon">Cataract Surgeon</SelectItem>
                                    <SelectItem value="General Ophthalmologist">General Ophthalmologist</SelectItem>
                                    <SelectItem value="Pediatric Ophthalmologist">Pediatric Ophthalmologist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Qualifications</Label>
                            <Input
                                value={doctorData.qualifications}
                                onChange={(e) => setDoctorData({...doctorData, qualifications: e.target.value})}
                                placeholder="MBBS, MD, FRCS"
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">License Number *</Label>
                            <Input
                                value={doctorData.license_number}
                                onChange={(e) => setDoctorData({...doctorData, license_number: e.target.value})}
                                placeholder="Medical license number"
                                required
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Experience (Years)</Label>
                            <Input
                                type="number"
                                value={doctorData.experience_years}
                                onChange={(e) => setDoctorData({...doctorData, experience_years: e.target.value})}
                                placeholder="10"
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Consultation Fee ($)</Label>
                            <Input
                                type="number"
                                value={doctorData.consultation_fee}
                                onChange={(e) => setDoctorData({...doctorData, consultation_fee: e.target.value})}
                                placeholder="150"
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-slate-800 dark:text-slate-200">Hospital/Organization</Label>
                        <Input
                            value={doctorData.hospital_affiliation}
                            onChange={(e) => setDoctorData({...doctorData, hospital_affiliation: e.target.value})}
                            placeholder="City General Hospital"
                            className="text-slate-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Contact Email</Label>
                            <Input
                                type="email"
                                value={doctorData.contact_email}
                                onChange={(e) => setDoctorData({...doctorData, contact_email: e.target.value})}
                                placeholder="doctor@hospital.com"
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-800 dark:text-slate-200">Contact Phone</Label>
                            <Input
                                value={doctorData.contact_phone}
                                onChange={(e) => setDoctorData({...doctorData, contact_phone: e.target.value})}
                                placeholder="+1 (555) 000-0000"
                                className="text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-slate-800 dark:text-slate-200">Bio/About</Label>
                        <Textarea
                            value={doctorData.bio}
                            onChange={(e) => setDoctorData({...doctorData, bio: e.target.value})}
                            placeholder="Brief description about the doctor..."
                            rows={3}
                            className="text-slate-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="medical-gradient">
                            Add Specialist
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [feeRangeFilter, setFeeRangeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsData, userData] = await Promise.all([
                    Doctor.list(),
                    User.me().catch(() => null)
                ]);
                setDoctors(doctorsData);
                setFilteredDoctors(doctorsData);
                setCurrentUser(userData);
            } catch (error) {
                console.error("Failed to load doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = doctors;

        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (doc.hospital_affiliation && doc.hospital_affiliation.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (specializationFilter !== "all") {
            filtered = filtered.filter(doc => doc.specialization === specializationFilter);
        }

        if (ratingFilter !== "all") {
            filtered = filtered.filter(doc => (doc.rating || 4.5) >= parseFloat(ratingFilter));
        }

        if (feeRangeFilter !== "all") {
            const [min, max] = feeRangeFilter.split('-').map(Number);
            filtered = filtered.filter(doc => {
                const fee = doc.consultation_fee || 150;
                return max ? fee >= min && fee <= max : fee >= min;
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'fee-low':
                    return (a.consultation_fee || 150) - (b.consultation_fee || 150);
                case 'fee-high':
                    return (b.consultation_fee || 150) - (a.consultation_fee || 150);
                case 'rating':
                    return (b.rating || 4.5) - (a.rating || 4.5);
                case 'experience':
                    return (b.experience_years || 10) - (a.experience_years || 10);
                default:
                    return a.full_name.localeCompare(b.full_name);
            }
        });

        setFilteredDoctors(filtered);
    }, [searchTerm, specializationFilter, ratingFilter, feeRangeFilter, sortBy, doctors]);

    const uniqueSpecializations = ["all", ...new Set(doctors.map(doc => doc.specialization))];

    const handleAddDoctor = async (doctorData) => {
        try {
            await Doctor.create(doctorData);
            toast.success("Specialist added successfully!");
            // Refresh the doctors list
            const updatedDoctors = await Doctor.list();
            setDoctors(updatedDoctors);
        } catch (error) {
            toast.error("Failed to add specialist.");
            console.error(error);
        }
    };

    const handleBookAppointment = (doctor) => {
        toast.success(`Booking appointment with ${doctor.full_name}...`);
    };

    const handleViewProfile = (doctor) => {
        toast.info(`Viewing ${doctor.full_name}'s profile...`);
    };

    const handleRateDoctor = (doctor) => {
        toast.info(`Rate & Review ${doctor.full_name}...`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-slate-700 dark:text-slate-300">Loading specialists...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">Find a Specialist</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Connect with our network of certified ophthalmologists and retinal specialists for expert consultation.
                    </p>
                </div>

                {/* Filters and Search */}
                <Card className="p-6 mb-8 shadow-lg border-0 bg-white dark:bg-slate-800">
                    <div className="space-y-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-5 h-5" />
                                <Input
                                    placeholder="Search by name, specialization, or hospital..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                                />
                            </div>
                            {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                                <Button 
                                    onClick={() => setIsAddDoctorOpen(true)}
                                    className="medical-gradient hover:opacity-90 text-white px-6"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Specialist
                                </Button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                                <SelectTrigger className="h-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="All Specializations" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueSpecializations.map(spec => (
                                        <SelectItem key={spec} value={spec} className="text-slate-900 dark:text-slate-100">
                                            {spec === 'all' ? 'All Specializations' : spec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                <SelectTrigger className="h-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700">
                                    <Star className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="All Ratings" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-slate-900 dark:text-slate-100">All Ratings</SelectItem>
                                    <SelectItem value="4.5" className="text-slate-900 dark:text-slate-100">4.5+ Stars</SelectItem>
                                    <SelectItem value="4.0" className="text-slate-900 dark:text-slate-100">4.0+ Stars</SelectItem>
                                    <SelectItem value="3.5" className="text-slate-900 dark:text-slate-100">3.5+ Stars</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={feeRangeFilter} onValueChange={setFeeRangeFilter}>
                                <SelectTrigger className="h-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="All Fees" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-slate-900 dark:text-slate-100">All Fees</SelectItem>
                                    <SelectItem value="0-100" className="text-slate-900 dark:text-slate-100">$0 - $100</SelectItem>
                                    <SelectItem value="100-200" className="text-slate-900 dark:text-slate-100">$100 - $200</SelectItem>
                                    <SelectItem value="200-300" className="text-slate-900 dark:text-slate-100">$200 - $300</SelectItem>
                                    <SelectItem value="300" className="text-slate-900 dark:text-slate-100">$300+</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name" className="text-slate-900 dark:text-slate-100">Name (A-Z)</SelectItem>
                                    <SelectItem value="rating" className="text-slate-900 dark:text-slate-100">Highest Rated</SelectItem>
                                    <SelectItem value="experience" className="text-slate-900 dark:text-slate-100">Most Experienced</SelectItem>
                                    <SelectItem value="fee-low" className="text-slate-900 dark:text-slate-100">Fee (Low to High)</SelectItem>
                                    <SelectItem value="fee-high" className="text-slate-900 dark:text-slate-100">Fee (High to Low)</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button 
                                variant="ghost" 
                                className="h-12 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSpecializationFilter('all');
                                    setRatingFilter('all');
                                    setFeeRangeFilter('all');
                                    setSortBy('name');
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-slate-700 dark:text-slate-300">
                        Showing {filteredDoctors.length} of {doctors.length} specialists
                    </p>
                </div>

                {filteredDoctors.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="max-w-md mx-auto">
                                <MessageSquare className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Specialists Found</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Try adjusting your search criteria or add new specialists to the directory.
                                </p>
                                {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                                    <Button 
                                        onClick={() => setIsAddDoctorOpen(true)}
                                        className="medical-gradient"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Specialist
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard 
                                key={doctor.id} 
                                doctor={doctor} 
                                onBookAppointment={handleBookAppointment}
                                onViewProfile={handleViewProfile}
                                onRateDoctor={handleRateDoctor}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddDoctorDialog 
                isOpen={isAddDoctorOpen}
                onClose={() => setIsAddDoctorOpen(false)}
                onSubmit={handleAddDoctor}
                currentUser={currentUser}
            />
        </div>
    );
}