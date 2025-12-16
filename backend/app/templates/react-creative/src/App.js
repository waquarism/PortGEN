import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Dribbble, ArrowRight, Layers, Smartphone, Globe } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="flex justify-center items-center min-h-screen font-bold text-blue-600">Loading Content...</div>;
    if (!data.personalInfo) return <div className="flex justify-center items-center min-h-screen text-red-500 font-bold">Error: Missing Personal Info</div>;

    const { personalInfo, skills, experience, education, projects } = data;

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-slate-800 overflow-x-hidden relative">

            {/* Big Blue Curve Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-50 to-transparent skew-x-12 -z-10"></div>

            <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-10">
                <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                    {personalInfo.fullName.split(' ')[0]}
                </div>
                <div className="hidden md:flex gap-8 font-bold text-sm text-slate-400">
                    <a href="#home" className="text-blue-600">HOME</a>
                    <a href="#about" className="hover:text-blue-600">ABOUT</a>
                    <a href="#portfolio" className="hover:text-blue-600">PORTFOLIO</a>
                    <a href="#contact" className="hover:text-blue-600">CONTACT</a>
                </div>
                <a href={`mailto:${personalInfo.email}`} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg transition-all">
                    LET'S TALK
                </a>
            </nav>

            <main className="max-w-7xl mx-auto px-8 relative z-10">

                {/* Header */}
                <header id="home" className="min-h-[80vh] flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 pt-12 md:pt-0">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="text-blue-600 font-bold tracking-widest text-sm mb-4">HEY THERE !</p>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-6">
                                I AM {personalInfo.fullName.toUpperCase()}
                            </h1>
                            <p className="text-xl md:text-2xl font-light text-slate-500 mb-8 max-w-xl">
                                {personalInfo.jobTitle.toUpperCase()} & CREATIVE THINKER
                            </p>

                            <div className="flex gap-4">
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform">
                                    SEE MY WORK
                                </button>
                                <div className="flex gap-2 items-center px-6">
                                    {personalInfo.socialLinks?.linkedin && <a href={personalInfo.socialLinks.linkedin} className="text-slate-400 hover:text-blue-600"><Linkedin /></a>}
                                    {personalInfo.socialLinks?.github && <a href={personalInfo.socialLinks.github} className="text-slate-400 hover:text-blue-600"><Github /></a>}
                                    {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-blue-600"><Mail /></a>}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative h-full flex justify-center items-center">
                        {/* Decorative Shapes behind placeholder */}
                        <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-6 opacity-20 scale-90"></div>
                        <div className="relative w-80 h-96 md:w-[450px] md:h-[550px] bg-white shadow-2xl rounded-[3rem] overflow-hidden flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
                            {/* Fallback if image doesn't load or looking for generic */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-8">
                                <p className="text-white font-bold text-xl">{personalInfo.fullName}</p>
                                <p className="text-blue-200 text-sm">{personalInfo.summary.slice(0, 50)}...</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats / Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 -mt-12 relative z-20">
                    {[
                        { label: "Years Exp", value: "5+" },
                        { label: "Projects", value: projects?.length || "10+" },
                        { label: "Clients", value: "20+" },
                        { label: "Awards", value: "8" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 text-center hover:-translate-y-2 transition-transform">
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">{stat.value}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* About / Skills */}
                <section id="about" className="mb-32">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-extrabold mb-6">About Me</h2>
                            <p className="text-slate-600 leading-loose text-lg mb-8">
                                {personalInfo.summary}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {skills?.technical?.slice(0, 6).map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                            <Layers size={18} />
                                        </div>
                                        <span className="font-bold text-slate-700">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                            <h3 className="text-2xl font-bold mb-8">My Experience</h3>
                            <div className="space-y-8 relative z-10">
                                {experience?.slice(0, 3).map((exp, i) => (
                                    <div key={i} className="border-l-2 border-white/20 pl-6 relative">
                                        <div className="absolute -left-[5px] top-1 w-2 h-2 bg-white rounded-full"></div>
                                        <h4 className="font-bold text-lg">{exp.role}</h4>
                                        <p className="text-blue-100 text-sm mb-1">{exp.company} | {exp.startDate}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portfolio */}
                {projects?.length > 0 && (
                    <section id="portfolio" className="mb-32">
                        <div className="text-center mb-16">
                            <p className="text-blue-600 font-bold tracking-widest text-sm mb-2">PORTFOLIO</p>
                            <h2 className="text-5xl font-black text-slate-900">Recent Works</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            {projects.map((proj, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden"
                                >
                                    <div className="h-64 bg-slate-100 relative overflow-hidden">
                                        {/* Mockup / Abstract Pattern */}
                                        <div className={`absolute inset-0 opacity-80 ${i % 2 === 0 ? 'bg-gradient-to-br from-blue-100 to-indigo-100' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/30 backdrop-blur-sm -skew-y-3 origin-bottom-right translate-y-4"></div>
                                        </div>
                                        <div className="absolute bottom-6 left-6 bg-white p-3 rounded-xl shadow-lg">
                                            <Layers className="text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{proj.title}</h3>
                                        <p className="text-slate-500 mb-6 line-clamp-2">{proj.description}</p>
                                        <a href={proj.link || "#"} className="flex items-center gap-2 font-bold text-sm text-slate-800 group-hover:gap-4 transition-all">
                                            VIEW CASE STUDY <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <footer className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
                    <h2 className="text-4xl font-black mb-6">Let's work together!</h2>
                    <p className="text-slate-400 max-w-lg mb-10">I am available for freelance projects. Feel free to contact me at any time.</p>
                    <a href={`mailto:${personalInfo.email}`} className="px-10 py-4 bg-blue-600 rounded-full font-bold shadow-lg shadow-blue-600/50 hover:bg-blue-500 transition-colors">
                        HIRE ME NOW
                    </a>
                    <div className="mt-20 pt-10 border-t border-slate-800 w-full flex justify-between text-slate-500 text-sm font-medium">
                        <p>© {new Date().getFullYear()} {personalInfo.fullName}</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default App;
