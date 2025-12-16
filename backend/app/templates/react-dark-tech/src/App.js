import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Globe, Github, Linkedin, Mail, ChevronRight, Code } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="min-h-screen bg-slate-950 text-cyan-500 font-mono flex items-center justify-center">Initializing System...</div>;
    if (!data.personalInfo) return <div className="min-h-screen bg-slate-950 text-red-500 font-mono flex items-center justify-center">System Error: Data Corruption</div>;

    const { personalInfo, skills, experience, education, projects } = data;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <h1 className="font-bold text-2xl text-white tracking-tighter">
                        <span className="text-cyan-400">&lt;</span>{personalInfo.fullName.split(' ')[0]}<span className="text-cyan-400">/&gt;</span>
                    </h1>
                    <div className="flex gap-6 text-sm font-medium text-slate-400">
                        <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
                        <a href="#stack" className="hover:text-cyan-400 transition-colors">Stack</a>
                        <a href="#work" className="hover:text-cyan-400 transition-colors">Work</a>
                    </div>
                    <a href="#contact" className="px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded hover:bg-cyan-500 hover:text-slate-950 transition-all font-bold text-sm">
                        Download CV
                    </a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">

                {/* Hero */}
                <section id="home" className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] mb-20">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono mb-6">
                                Hello, It's Me
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                {personalInfo.fullName}
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-400 mb-6">
                                And I'm a <span className="text-cyan-400">{personalInfo.jobTitle}</span>
                            </h2>
                            <p className="text-slate-400 leading-relaxed max-w-xl mb-10 text-lg">
                                {personalInfo.summary}
                            </p>

                            <div className="flex gap-4">
                                <div className="p-3 bg-slate-900 rounded-full text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer">
                                    <Github size={20} />
                                </div>
                                <div className="p-3 bg-slate-900 rounded-full text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer">
                                    <Linkedin size={20} />
                                </div>
                                <div className="p-3 bg-slate-900 rounded-full text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer">
                                    <Mail size={20} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center relative">
                        {/* Hexagon Shape Container */}
                        <div className="relative w-80 h-80 md:w-[400px] md:h-[400px] group">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full"></div>
                            {/* Hexagon Border */}
                            <div className="absolute inset-0 bg-slate-900 border-2 border-cyan-500/50" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>

                            {/* Inner Content (Placeholder for Image) */}
                            <div className="absolute inset-2 bg-slate-800 flex items-center justify-center overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                {/* If user had image, it would go here. Using a gradient/icon placeholder */}
                                <div className="bg-gradient-to-b from-slate-700 to-slate-900 w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                    <Terminal size={64} className="text-cyan-500 mb-4 opacity-50" />
                                    <p className="text-cyan-400 font-mono text-sm opacity-80">System.User<br />{personalInfo.fullName}</p>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -right-4 top-20 bg-slate-900 border border-cyan-500/50 p-4 rounded-xl shadow-xl shadow-cyan-900/20 z-10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded text-cyan-400"><Code size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400">Experience</p>
                                        <p className="font-bold text-white">5+ Years</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Skills / Services */}
                <section id="stack" className="mb-32">
                    <h2 className="text-3xl font-bold text-white mb-16 text-center">Technical <span className="text-cyan-400">Stack</span></h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {skills?.technical?.map((skill, i) => (
                            <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-2xl hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all group">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                                    <Cpu size={20} />
                                </div>
                                <h3 className="font-bold text-white">{skill}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects / About Me layout similar to ref image 4 */}
                <section id="work" className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* About Box */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl"></div>
                            <h2 className="text-3xl font-bold text-white mb-8">About <span className="text-cyan-400">Me</span></h2>

                            <div className="flex justify-center mb-8">
                                <div className="w-48 h-48 rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden relative">
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <Terminal className="text-slate-500" size={48} />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-center text-xl font-bold text-white mb-2">{personalInfo.fullName}</h3>
                            <p className="text-center text-cyan-400 text-sm mb-6">{personalInfo.jobTitle}</p>

                            <p className="text-slate-400 text-center leading-relaxed text-sm">
                                {personalInfo.summary}
                            </p>

                            <div className="mt-8 flex justify-center">
                                <button className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors">
                                    Read More
                                </button>
                            </div>
                        </div>

                        {/* Latest Projects Grid */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">Latest <span className="text-cyan-400">Projects</span></h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {projects?.slice(0, 4).map((proj, i) => (
                                    <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                        <div className="h-40 bg-slate-800 relative">
                                            {/* Placeholder Overlay */}
                                            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={proj.link || "#"} className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-full">
                                                    View Project
                                                </a>
                                            </div>
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <Code size={32} />
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-white font-bold mb-1 truncate">{proj.title}</h4>
                                            <p className="text-slate-500 text-xs line-clamp-2">{proj.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Contact Form Area (Visual only) */}
                <section id="contact" className="max-w-3xl mx-auto text-center mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8">Contact <span className="text-cyan-400">Me!</span></h2>
                    <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl text-left">
                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <input className="bg-slate-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors" placeholder="Full Name" />
                            <input className="bg-slate-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors" placeholder="Email Address" />
                        </div>
                        <textarea className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors mb-6" rows={4} placeholder="Your Message"></textarea>
                        <button className="w-full py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                            Send Message
                        </button>
                    </div>
                </section>

                <footer className="text-center text-slate-600 text-sm">
                    <p>Copyright © {new Date().getFullYear()} by {personalInfo.fullName}.</p>
                </footer>

            </main>
        </div>
    );
}

export default App;
