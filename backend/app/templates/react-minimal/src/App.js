import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Smartphone, User, Briefcase, Code, Hash } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">Loading...</div>;
    if (!data.personalInfo) return <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">Error: Missing Data</div>;

    const { personalInfo, skills, experience, education, projects } = data;

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-yellow-200">

            {/* Navigation (Simple) */}
            <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center">
                <div className="font-bold text-xl tracking-tight">Portfolio.</div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
                    <a href="#about" className="hover:text-black transition-colors">About</a>
                    <a href="#skills" className="hover:text-black transition-colors">Skills</a>
                    <a href="#projects" className="hover:text-black transition-colors">Projects</a>
                    <a href="#contact" className="hover:text-black transition-colors">Contact</a>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">

                {/* Hero Section */}
                <section id="about" className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24 mb-32">
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-medium text-gray-500 mb-2">Hi, I am</h2>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight leading-1.1">
                                {personalInfo.fullName.split(' ')[0]} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                                    {personalInfo.fullName.split(' ').slice(1).join(' ')}
                                </span>
                            </h1>
                            <p className="text-xl font-medium text-gray-600 mb-6">{personalInfo.jobTitle}</p>
                            <p className="text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0 mb-8 text-lg">
                                {personalInfo.summary}
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <a href="mailto:email@example.com" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-transform hover:-translate-y-1 shadow-lg shadow-gray-200">
                                    Hire Me
                                </a>
                                <a href="#projects" className="bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                    View Work
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative flex justify-center">
                        {/* Yellow Circle Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-yellow-300 rounded-full z-0 opacity-80 mix-blend-multiply filter blur-sm"></div>

                        {/* Avatar Placeholder */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 w-72 h-72 bg-white border-4 border-white rounded-full shadow-2xl overflow-hidden flex items-center justify-center text-gray-300"
                        >
                            <User size={120} strokeWidth={1} />
                        </motion.div>
                    </div>
                </section>

                {/* Info Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-lg transition-shadow">
                        <Mail className="text-yellow-500 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Email Me</h3>
                        <p className="text-gray-500 break-words">{personalInfo.email}</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-lg transition-shadow">
                        <Smartphone className="text-blue-500 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Call Me</h3>
                        <p className="text-gray-500">{personalInfo.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-lg transition-shadow">
                        <Github className="text-gray-900 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Socials</h3>
                        <div className="flex gap-4">
                            {personalInfo.socialLinks?.github && <a href={personalInfo.socialLinks.github} className="text-gray-500 hover:text-black">GitHub</a>}
                            {personalInfo.socialLinks?.linkedin && <a href={personalInfo.socialLinks.linkedin} className="text-gray-500 hover:text-blue-600">LinkedIn</a>}
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section id="skills" className="mb-32">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-4xl font-extrabold mb-4">Skill Sets</h2>
                        <div className="h-1 w-20 bg-yellow-300 mx-auto md:mx-0 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills?.technical?.map((skill, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white border border-gray-100 shadow-sm p-4 rounded-xl flex items-center gap-3 font-semibold text-gray-700"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                {experience?.length > 0 && (
                    <section className="mb-32">
                        <div className="mb-12 text-center md:text-left">
                            <h2 className="text-4xl font-extrabold mb-4">Experience</h2>
                            <div className="h-1 w-20 bg-blue-300 mx-auto md:mx-0 rounded-full"></div>
                        </div>
                        <div className="space-y-8 max-w-4xl">
                            {experience.map((exp, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12 relative pb-8 border-l-2 border-gray-100 pl-8 ml-3 md:ml-0 md:pl-0 md:border-l-0">
                                    <div className="md:w-1/4 md:text-right">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{exp.startDate} - {exp.endDate}</span>
                                        <h4 className="font-bold text-gray-900 mt-1">{exp.company}</h4>
                                    </div>

                                    {/* Timeline Dot (Mobile only logic handled by border-l above, but lets add a dot for desktop visual) */}
                                    <div className="hidden md:block w-4 h-4 bg-gray-200 rounded-full mt-1 relative z-10 border-4 border-white shadow-sm self-start shrink-0"></div>

                                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
                                        <h3 className="text-xl font-bold mb-2 text-gray-800">{exp.role}</h3>
                                        {exp.description?.length > 0 && (
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-gray-600 leading-relaxed">
                                                {exp.description.map((desc, d) => <li key={d}>{desc}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section id="projects">
                        <div className="mb-12 text-center md:text-left">
                            <h2 className="text-4xl font-extrabold mb-4">Featured Work</h2>
                            <div className="h-1 w-20 bg-purple-300 mx-auto md:mx-0 rounded-full"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((proj, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="group bg-gray-900 text-white p-8 rounded-3xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Hash size={120} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{proj.title}</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">
                                        {proj.description}
                                    </p>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                                            View Project
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <footer className="bg-gray-50 py-12 text-center text-sm font-medium text-gray-400">
                <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default App;
