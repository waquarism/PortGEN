import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail, ArrowUpRight, Instagram, Dribbble, Twitter } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);
    const [hoveredBox, setHoveredBox] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="min-h-screen bg-stone-100 flex items-center justify-center font-black text-4xl tracking-tighter">LOADING...</div>;
    if (!data.personalInfo) return <div className="min-h-screen bg-stone-100 flex items-center justify-center font-bold text-red-500 text-2xl">DATA ERROR</div>;

    const { personalInfo, skills, experience, projects } = data;

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 p-4 md:p-8 font-sans selection:bg-purple-300">

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. HERO - NAME (Big Box) */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-4 lg:col-span-4 xl:col-span-4 bg-[#CCF381] rounded-[2rem] p-10 flex flex-col justify-between min-h-[400px] hover:shadow-2xl hover:shadow-[#CCF381]/50 transition-all group relative overflow-hidden"
                    onMouseEnter={() => setHoveredBox('hero')}
                    onMouseLeave={() => setHoveredBox(null)}
                >
                    <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ArrowUpRight size={80} className="stroke-1" />
                    </div>
                    <div>
                        <div className="inline-block px-4 py-2 bg-black text-white rounded-full font-bold text-sm mb-6 animate-bounce">
                            Open for work
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.8] tracking-tighter mb-4">
                            {personalInfo.fullName.split(' ')[0]}<br />
                            <span className="outline-text text-transparent stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>{personalInfo.fullName.split(' ')[1]}</span>
                        </h1>
                    </div>
                    <div>
                        <p className="text-2xl font-bold tracking-tight max-w-md leading-tight">{personalInfo.jobTitle}</p>
                        <p className="text-stone-600 font-medium mt-2">{personalInfo.summary.slice(0, 80)}...</p>
                    </div>
                </motion.div>

                {/* 2. PROFILE PHOTO / ICON */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 lg:col-span-2 xl:col-span-2 bg-black rounded-[2rem] overflow-hidden relative group"
                >
                    {/* Placeholder for real image, using abstract gradient/icon */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <span className="text-white font-black text-9xl leading-none opacity-20 select-none">Me</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold text-xl">Based in</p>
                        <p className="text-stone-400">New York, USA</p>
                    </div>
                </motion.div>

                {/* 3. SOCIAL LINKS */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="md:col-span-2 lg:col-span-2 xl:col-span-2 bg-white rounded-[2rem] p-8 flex flex-col justify-center gap-4 border border-stone-200 hover:border-black transition-colors"
                >
                    <h3 className="font-bold text-stone-400 uppercase tracking-widest text-sm mb-2">Connect</h3>
                    <div className="flex flex-wrap gap-2">
                        {personalInfo.socialLinks?.github && (
                            <a href={personalInfo.socialLinks.github} className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Github size={20} /></a>
                        )}
                        {personalInfo.socialLinks?.linkedin && (
                            <a href={personalInfo.socialLinks.linkedin} className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors"><Linkedin size={20} /></a>
                        )}
                        <a href={`mailto:${personalInfo.email}`} className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Mail size={20} /></a>
                        <a href="#" className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"><Instagram size={20} /></a>
                    </div>
                </motion.div>

                {/* 4. ABOUT TEXT (Wide) */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-4 lg:col-span-3 xl:col-span-3 bg-[#E9E9E9] rounded-[2rem] p-10 flex flex-col justify-between"
                >
                    <div className="w-10 h-10 bg-stone-300 rounded-full mb-6"></div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight">
                        "{personalInfo.summary}"
                    </p>
                </motion.div>

                {/* 5. STATS / EXPERIENCE */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="md:col-span-2 lg:col-span-3 xl:col-span-3 bg-[#4834D4] text-white rounded-[2rem] p-10 relative overflow-hidden group"
                >
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-2xl font-bold mb-8">Work Experience</h3>
                    <div className="space-y-6 relative z-10">
                        {experience?.slice(0, 2).map((exp, i) => (
                            <div key={i} className="border-l-2 border-white/30 pl-4">
                                <h4 className="font-bold text-lg">{exp.role}</h4>
                                <p className="text-indigo-200 text-sm">{exp.company}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 6. SKILLS CLOUD */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-4 lg:col-span-2 xl:col-span-2 bg-black text-white rounded-[2rem] p-8 flex flex-col"
                >
                    <h3 className="font-bold text-stone-500 uppercase mb-6">Toolkit</h3>
                    <div className="flex flex-wrap gap-2 content-start">
                        {skills?.technical?.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* 7. PROJECTS (Grid within Grid) */}
                {projects?.map((proj, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className={`md:col-span-2 lg:col-span-2 xl:col-span-2 rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px] hover:scale-[1.02] transition-transform duration-300 group ${i % 3 === 0 ? 'bg-[#FF9FF3]' : i % 3 === 1 ? 'bg-[#54a0ff]' : 'bg-[#5f27cd] text-white'
                            }`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                                    <span className="font-bold text-sm">{i + 1}</span>
                                </div>
                                {proj.link && (
                                    <a href={proj.link} className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight size={16} />
                                    </a>
                                )}
                            </div>
                            <h3 className="text-2xl font-black leading-tight tracking-tight mb-2">{proj.title}</h3>
                            <p className={`text-sm font-medium line-clamp-3 ${i % 3 === 2 ? 'text-purple-200' : 'text-stone-700'}`}>
                                {proj.description}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {/* 8. FOOTER BOX */}
                <motion.div
                    className="md:col-span-4 lg:col-span-8 xl:col-span-8 bg-white rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-200"
                >
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Have a project in mind?</h2>
                        <p className="text-stone-500 font-medium">Let's build something awesome together.</p>
                    </div>
                    <a href={`mailto:${personalInfo.email}`} className="px-10 py-4 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform">
                        Contact Me
                    </a>
                </motion.div>

            </div>
        </div>
    );
}

export default App;
