import React, { useState, useEffect } from 'react';
import portfolioData from './portfolio-data.json';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Smartphone } from 'lucide-react';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(portfolioData);
    }, []);

    if (!data) return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading...</div>;

    const { personalInfo, skills, experience, education, projects } = data;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 font-sans text-gray-800">
            {/* Header / Personal Info */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-16 text-center"
            >
                <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {personalInfo.fullName}
                </h1>
                <p className="text-xl text-gray-600 font-medium mb-2">{personalInfo.jobTitle}</p>
                <p className="text-md text-gray-500 max-w-2xl mx-auto leading-relaxed">{personalInfo.summary}</p>

                <div className="flex justify-center gap-6 mt-6 flex-wrap">
                    {personalInfo.email && (
                        <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Mail size={18} /> {personalInfo.email}
                        </a>
                    )}
                    {personalInfo.phone && (
                        <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Smartphone size={18} /> {personalInfo.phone}
                        </a>
                    )}
                    {personalInfo.socialLinks?.linkedin && (
                        <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Linkedin size={18} /> LinkedIn
                        </a>
                    )}
                    {personalInfo.socialLinks?.github && (
                        <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Github size={18} /> GitHub
                        </a>
                    )}
                </div>
            </motion.header>

            {/* Skills */}
            {skills?.technical?.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2 text-gray-800">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills.technical.map((skill, index) => (
                            <motion.span
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-2 text-gray-800">Experience</h2>
                    <div className="space-y-10 border-l-2 border-indigo-100 ml-3 pl-8 relative">
                        {experience.map((exp, index) => (
                            <div key={index} className="relative">
                                <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-500"></span>
                                <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                                <div className="text-indigo-600 font-medium mb-2">{exp.company}</div>
                                <p className="text-sm text-gray-500 mb-4">{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</p>
                                {exp.description?.length > 0 && (
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600">
                                        {exp.description.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2 text-gray-800">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((proj, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-lg mb-2 text-gray-900">{proj.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{proj.description}</p>
                                {proj.link && (
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
                                        View Project &rarr;
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2 text-gray-800">Education</h2>
                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <div className="text-gray-600">{edu.institution}</div>
                                </div>
                                <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 mt-2 sm:mt-0">
                                    {edu.endDate}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <footer className="text-center text-gray-400 mt-20 pb-8 text-sm">
                <p>&copy; {new Date().getFullYear()} {personalInfo.fullName}. Generated by PortGEN.</p>
            </footer>
        </div>
    );
}

export default App;
