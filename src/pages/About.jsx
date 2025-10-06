
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Eye, 
    Brain, 
    Shield, 
    Award, 
    Users, 
    Globe, 
    ArrowRight,
    CheckCircle,
    Microscope,
    Heart,
    Target
} from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10"></div>
                <div className="relative max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Microscope className="w-4 h-4" />
                        Advanced Medical Technology
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Revolutionizing <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Eye Care</span> with AI
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        RetinAI combines cutting-edge artificial intelligence with medical expertise to provide 
                        accurate, fast, and accessible retinal disease diagnosis worldwide.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                We believe everyone deserves access to world-class eye care. Our AI-powered platform 
                                democratizes retinal disease diagnosis, making it faster, more accurate, and globally accessible.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-slate-700">Early detection saves vision</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-slate-700">AI-powered accuracy and speed</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-slate-700">Accessible healthcare for all</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-80 h-80 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                                <Eye className="w-32 h-32 text-white" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                                <Brain className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Advanced AI Technology</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our platform uses state-of-the-art machine learning models trained on thousands of retinal images
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">Deep Learning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Advanced convolutional neural networks trained on extensive datasets 
                                    of fundus images for precise pattern recognition.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">Precision Diagnosis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    Specialized detection algorithms for AME, DME, and various 
                                    macular disorders with clinical-grade accuracy.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900">Secure & Compliant</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600">
                                    HIPAA-compliant infrastructure with end-to-end encryption 
                                    ensuring patient data privacy and security.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Making an Impact</h2>
                        <p className="text-lg text-slate-600">Our technology is helping patients and doctors worldwide</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">10K+</div>
                            <div className="text-slate-600">Images Analyzed</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">500+</div>
                            <div className="text-slate-600">Healthcare Providers</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">25+</div>
                            <div className="text-slate-600">Countries Served</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">95%+</div>
                            <div className="text-slate-600">Accuracy Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Experience the Future of Eye Care?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join healthcare professionals worldwide who trust RetinAI for accurate retinal diagnosis
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={createPageUrl("Diagnosis")}>
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                                Try Free Diagnosis
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to={createPageUrl("Doctors")}>
                            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                                Find Specialists
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
