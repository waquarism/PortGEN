import React, { useState } from "react";
import { motion } from "framer-motion";
import Upload from "./Upload";
import { Sun, Moon } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">

        {/* ---------------- HEADER ---------------- */}
        <header className="flex justify-between items-center px-8 py-5 shadow-sm bg-white dark:bg-gray-800">
          <h1 className="text-2xl font-extrabold tracking-tight">PortGen</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </header>

        {/* ---------------- HERO ---------------- */}
        <main className="max-w-5xl mx-auto px-6 py-14">
          <section className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-4"
              >
                Create Your Portfolio Automatically
              </motion.h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Upload your resume in PDF or DOCX format and let AI generate a complete professional portfolio website — including template, content, and downloadable code.
              </p>

              <Upload />
            </div>

            <img 
              src="/illustrate.png"
              alt="resume-illustration"
              className="w-64 md:w-1/2"
            />

          </section>

          {/* ---------------- WIDGETS ---------------- */}

          <section className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI Resume Parsing",
                desc: "Our advanced parser extracts skills, experience, projects, and contact details automatically."
              },
              {
                icon: "🎨",
                title: "Auto Portfolio Generation",
                desc: "Beautiful pre-designed responsive portfolio templates ready to deploy."
              },
              {
                icon: "⬇️",
                title: "One-Click ZIP Download",
                desc: "Download a complete code bundle with HTML/CSS/JS + assets for your generated portfolio."
              },
              {
                icon: "⚡",
                title: "Fast & Reliable",
                desc: "Built to generate completed portfolios instantly without slowing down."
              },
              {
                icon: "🌗",
                title: "Light & Dark Mode",
                desc: "A great browsing experience with modern UI color themes."
              },
              {
                icon: "📱",
                title: "Responsive Output",
                desc: "Your generated portfolio works beautifully on mobile, tablet, and desktop."
              }
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-xl mb-2">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{card.desc}</p>
              </div>
            ))}
          </section>
        </main>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="text-center py-6 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-16">
          © {new Date().getFullYear()} AI Portfolio Generator — Built by Waquar
        </footer>
      </div>
    </div>
  );
}

export default App;
