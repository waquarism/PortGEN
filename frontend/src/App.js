import React, { useState } from "react";
import { motion } from "framer-motion";
import Upload from "./Upload";
import { Sun, Moon } from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isExpanded, setIsExpanded] = useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-gray-800 dark:text-gray-200 font-sans">

        {/* ---------------- HEADER ---------------- */}
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              P
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              PortGen
            </h1>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} className="fill-current" /> : <Moon size={20} className="fill-current" />}
          </button>
        </header>

        {/* ---------------- HERO ---------------- */}
        <main className={`mx-auto px-6 pt-32 pb-20 transition-all duration-500 ${isExpanded ? 'max-w-7xl' : 'max-w-6xl'}`}>
          <section className={`flex flex-col md:flex-row items-center gap-16 ${isExpanded ? 'justify-center' : ''}`}>
            <div className={`text-center md:text-left transition-all duration-500 ${isExpanded ? 'w-full' : 'md:w-1/2'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
                  ✨ AI-Powered Portfolio Builder
                </div>
                <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
                  Build your dream <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    portfolio in seconds.
                  </span>
                </h2>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                  Upload your resume and let our AI craft a professional, responsive, and stunning portfolio website for you. No coding required.
                </p>

                <Upload onExpand={() => setIsExpanded(true)} />
              </motion.div>
            </div>

            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative md:w-1/2"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                <img
                  src="/illustrate.png"
                  alt="resume-illustration"
                  className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </motion.div>
            )}

          </section>

          {/* ---------------- WIDGETS ---------------- */}

          <section className="mt-32">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Why use PortGen?</h3>
              <p className="text-gray-500 dark:text-gray-400">Everything you need to showcase your work professionally.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧠",
                  title: "Smart Parsing",
                  desc: "We extract every detail from your resume with high precision using BERT models."
                },
                {
                  icon: "🎨",
                  title: "Premium Templates",
                  desc: "Choose from 5+ high-quality designs including Dark Tech, Minimalist, and Creative."
                },
                {
                  icon: "🚀",
                  title: "Instant Export",
                  desc: "Get production-ready React code. Just npm install and deploy."
                },
                {
                  icon: "⚡",
                  title: "Blazing Fast",
                  desc: "Generate a complete website in under 10 seconds."
                },
                {
                  icon: "🌗",
                  title: "Dark Mode Ready",
                  desc: "All templates come with built-in dark mode support."
                },
                {
                  icon: "📱",
                  title: "Fully Responsive",
                  desc: "Looks perfect on every device, from mobile phones to 4k monitors."
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-4xl mb-6 bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center">{card.icon}</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="text-center py-10 text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <p>© {new Date().getFullYear()} PortGen. Built with ❤️ by Waquarism.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
