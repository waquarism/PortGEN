import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Smartphone, Briefcase, Award, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="flex justify-center items-center min-h-screen text-slate-500 font-serif">Loading...</div>;
    if (!data.personalInfo) return <div className="flex justify-center items-center min-h-screen text-red-500 font-serif">Error: Data Missing</div>;

    const { personalInfo, skills, experience, education, projects } = data;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">

            {/* Navbar */}
            <nav className="bg-white shadow-sm py-4">
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {personalInfo.fullName[0]}
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">PORTFOLIO</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
                        <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
                        <a href="#about" className="hover:text-red-500 transition-colors">About</a>
                        <a href="#services" className="hover:text-red-500 transition-colors">Services</a>
                        <a href="#projects" className="hover:text-red-500 transition-colors">Portfolio</a>
                        <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
                    </div>
                    <a href="#contact" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded text-sm font-bold shadow-lg shadow-red-500/20 transition-all">
                        Get Consultant
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="bg-slate-100 py-24 md:py-32 relative overflow-hidden">
                {/* Curve at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'ellipse(70% 50% at 50% 100%)' }}></div>

                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-red-500 font-bold uppercase tracking-wider text-sm mb-4">Get Every Single Solutions.</p>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight font-serif">
                            I’m Designer <br />
                            <span className="text-slate-700">{personalInfo.fullName}</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
                            {personalInfo.summary}
                        </p>

                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-red-500 text-white font-bold rounded shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">
                                Learn More
                            </button>
                            <button className="px-8 py-3 bg-white text-slate-800 font-bold rounded border border-slate-200 hover:bg-slate-50 transition-colors">
                                Hire Me
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative flex justify-center"
                    >
                        {/* Clean photo frame style */}
                        <div className="relative w-80 h-96 bg-white p-4 shadow-2xl rotate-3 rounded-lg z-10">
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                <span className="font-serif italic text-2xl">Photo</span>
                            </div>
                        </div>
                        <div className="absolute top-4 w-80 h-96 border-4 border-red-500/20 -rotate-3 rounded-lg z-0"></div>
                    </motion.div>
                </div>
            </section>

            {/* Services / Skills */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-500 font-bold uppercase tracking-wider text-sm">Skills & expertise</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">My Specialization</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {skills?.technical?.slice(0, 6).map((skill, i) => (
                            <div key={i} className="group p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <CheckCircle />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{skill}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">Professional expertise in {skill}, delivering high-quality solutions for modern web requirements.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div>
                        <span className="text-red-500 font-bold uppercase tracking-wider text-sm">Career Path</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-8 font-serif">Work Experience</h2>
                        <div className="space-y-8">
                            {experience?.map((exp, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/40"></div>
                                        <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                                    </div>
                                    <div className="pb-8">
                                        <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                                        <p className="text-red-500 font-semibold text-sm mb-2">{exp.company} <span className="text-slate-400 font-normal">| {exp.startDate} - {exp.endDate}</span></p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{exp.description?.[0]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-slate-900 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                            <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Need a Project?</span>
                            <h2 className="text-3xl font-bold mt-4 mb-6 font-serif">Let's work together to create something unique.</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                I am ready to work on your next project with professional dedication and creative solutions.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-red-400"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Email Me</p>
                                        <p className="font-bold">{personalInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-red-400"><Smartphone size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Call Me</p>
                                        <p className="font-bold">{personalInfo.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid */}
            {projects?.length > 0 && (
                <section id="projects" className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-red-500 font-bold uppercase tracking-wider text-sm">My Portfolio</span>
                            <h2 className="text-4xl font-bold text-slate-900 mt-2 font-serif">Recent Projects</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((proj, i) => (
                                <div key={i} className="group relative overflow-hidden rounded-lg bg-slate-900">
                                    <div className="aspect-video bg-slate-800 opacity-80 group-hover:opacity-40 transition-opacity"></div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <h3 className="text-2xl font-bold text-white mb-2">{proj.title}</h3>
                                        <p className="text-slate-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{proj.description}</p>
                                        {proj.link && (
                                            <a href={proj.link} className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide hover:text-red-400 transition-colors">
                                                View Details <ArrowRight size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <footer className="bg-slate-900 text-slate-400 py-12 text-center">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-center items-center gap-2 mb-8 text-white font-bold text-xl">
                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-xs">P</div>
                        PORTFOLIO
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved. Designed with PortGEN.</p>
                </div>
            </footer>

        </div>
    );
}

export default App;
