import axios from "axios";
import { motion } from "framer-motion";
import { FileUp, FileText, Download, Save, RefreshCw, Briefcase, GraduationCap, Link2, Code, Plus, Trash2 } from "lucide-react";

import React, { useState } from "react";

export default function Upload({ onExpand }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Please choose a file.");
    setLoading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/parse", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(res.data.parsed);
      setId(res.data.id);
      if (onExpand) onExpand();
    } catch (e) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setPreview({
      ...preview,
      personalInfo: { ...preview.personalInfo, [field]: value }
    });
  };

  const updateSkill = (index, value) => {
    const newSkills = [...preview.skills.technical];
    newSkills[index] = value;
    setPreview({
      ...preview,
      skills: { ...preview.skills, technical: newSkills }
    });
  };

  const addSkill = () => {
    setPreview({
      ...preview,
      skills: {
        ...preview.skills,
        technical: [...(preview.skills.technical || []), "New Skill"]
      }
    });
  };

  const removeSkill = (index) => {
    const newSkills = [...preview.skills.technical];
    newSkills.splice(index, 1);
    setPreview({
      ...preview,
      skills: { ...preview.skills, technical: newSkills }
    });
  };

  const updateList = (section, index, field, value) => {
    const list = [...preview[section]];
    list[index] = { ...list[index], [field]: value };
    setPreview({ ...preview, [section]: list });
  };

  const updateListWorkDesc = (expIndex, descIndex, value) => {
    const list = [...preview.experience];
    const newDesc = [...list[expIndex].description];
    newDesc[descIndex] = value;
    list[expIndex].description = newDesc;
    setPreview({ ...preview, experience: list });
  };

  const addListWorkDesc = (expIndex) => {
    const list = [...preview.experience];
    if (!list[expIndex].description) list[expIndex].description = [];
    list[expIndex].description.push("New responsibility");
    setPreview({ ...preview, experience: list });
  };

  const removeListWorkDesc = (expIndex, descIndex) => {
    const list = [...preview.experience];
    list[expIndex].description.splice(descIndex, 1);
    setPreview({ ...preview, experience: list });
  };

  const addListItem = (section, initialObj) => {
    setPreview({
      ...preview,
      [section]: [...(preview[section] || []), initialObj]
    });
  };

  const removeListItem = (section, index) => {
    const list = [...preview[section]];
    list.splice(index, 1);
    setPreview({ ...preview, [section]: list });
  };

  const downloadZip = async () => {
    setGenLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/generate/${id}`,
        {
          data: preview,
          template: "react-minimal"
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}_portfolio.zip`;
      a.click();
    } catch (e) {
      alert("Generation failed");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center w-full">

      {!preview && (
        <div className="w-full max-w-xl p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-center transition hover:border-blue-500">
          <FileUp size={40} className="mx-auto mb-4 text-gray-500 dark:text-gray-400" />
          <p className="font-semibold mb-2 text-lg">Upload your resume</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Supported formats: PDF, DOCX</p>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={upload} disabled={loading} className="mt-6 px-6 py-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
            {loading ? "Processing..." : "Generate Portfolio"}
          </button>
        </div>
      )}

      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-left overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <FileText className="text-blue-600" size={20} /> Edit Portfolio Content
            </h3>
            <button onClick={() => { setPreview(null); }} className="text-sm text-red-500 hover:text-red-600 font-medium">Reset</button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* Personal Info */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                    <input className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={preview.personalInfo?.fullName || ""}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Job Title</label>
                    <input className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={preview.personalInfo?.jobTitle || ""}
                      onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
                    <input className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={preview.personalInfo?.email || ""}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Phone</label>
                    <input className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={preview.personalInfo?.phone || ""}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Summary</label>
                    <textarea className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" rows={4}
                      value={preview.personalInfo?.summary || ""}
                      onChange={(e) => updatePersonalInfo("summary", e.target.value)} />
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2"><Code size={16} /> Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {preview.skills?.technical?.map((skill, i) => (
                    <div key={i} className="flex bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                      <input className="bg-transparent p-1.5 w-24 text-sm text-center outline-none"
                        value={skill} onChange={(e) => updateSkill(i, e.target.value)} />
                      <button onClick={() => removeSkill(i)} className="px-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">×</button>
                    </div>
                  ))}
                  <button onClick={addSkill} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition font-medium flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* Experience */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><Briefcase size={16} /> Experience</h4>
                  <button onClick={() => addListItem("experience", { company: "New Company", role: "Role", startDate: "", endDate: "", description: [] })} className="text-xs text-blue-500 font-bold hover:underline">+ Add Job</button>
                </div>
                <div className="space-y-4">
                  {preview.experience?.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 group relative">
                      <button onClick={() => removeListItem("experience", i)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input className="p-2 rounded border bg-white dark:bg-gray-600 dark:border-gray-500 font-bold text-gray-900 dark:text-white"
                          placeholder="Role" value={exp.role || ""} onChange={(e) => updateList("experience", i, "role", e.target.value)} />
                        <input className="p-2 rounded border bg-white dark:bg-gray-600 dark:border-gray-500"
                          placeholder="Company" value={exp.company || ""} onChange={(e) => updateList("experience", i, "company", e.target.value)} />
                        <input className="p-2 rounded border bg-white dark:bg-gray-600 dark:border-gray-500 text-xs"
                          placeholder="Start Date" value={exp.startDate || ""} onChange={(e) => updateList("experience", i, "startDate", e.target.value)} />
                        <input className="p-2 rounded border bg-white dark:bg-gray-600 dark:border-gray-500 text-xs"
                          placeholder="End Date" value={exp.endDate || ""} onChange={(e) => updateList("experience", i, "endDate", e.target.value)} />
                      </div>
                      <div className="pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-2">
                        {exp.description?.map((desc, dIndex) => (
                          <div key={dIndex} className="flex gap-2">
                            <textarea rows={1} className="w-full text-xs p-1.5 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none resize-none"
                              value={desc} onChange={(e) => updateListWorkDesc(i, dIndex, e.target.value)} />
                            <button onClick={() => removeListWorkDesc(i, dIndex)} className="text-gray-400 hover:text-red-400">×</button>
                          </div>
                        ))}
                        <button onClick={() => addListWorkDesc(i)} className="text-xs text-blue-500 mt-1 hover:underline">+ Add Bullet Point</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><GraduationCap size={16} /> Education</h4>
                  <button onClick={() => addListItem("education", { institution: "University", degree: "Degree", endDate: "" })} className="text-xs text-blue-500 font-bold hover:underline">+ Add Education</button>
                </div>
                <div className="space-y-3">
                  {preview.education?.map((edu, i) => (
                    <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex gap-2 items-center bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex-1 grid grid-cols-1 gap-2">
                        <input className="p-1.5 bg-transparent font-semibold outline-none"
                          placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateList("education", i, "degree", e.target.value)} />
                        <div className="flex gap-2 text-sm text-gray-500">
                          <input className="flex-1 bg-transparent outline-none"
                            placeholder="Institution" value={edu.institution || ""} onChange={(e) => updateList("education", i, "institution", e.target.value)} />
                          <input className="w-20 bg-transparent outline-none text-right"
                            placeholder="Year" value={edu.endDate || ""} onChange={(e) => updateList("education", i, "endDate", e.target.value)} />
                        </div>
                      </div>
                      <button onClick={() => removeListItem("education", i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><Link2 size={16} /> Projects</h4>
                  <button onClick={() => addListItem("projects", { title: "Project Name", description: "Description...", link: "" })} className="text-xs text-blue-500 font-bold hover:underline">+ Add Project</button>
                </div>
                <div className="space-y-4">
                  {preview.projects?.map((proj, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 relative">
                      <button onClick={() => removeListItem("projects", i)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      <input className="block w-full bg-transparent font-bold mb-2 outline-none" placeholder="Project Title"
                        value={proj.title || ""} onChange={(e) => updateList("projects", i, "title", e.target.value)} />
                      <textarea rows={2} className="block w-full bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 p-2 text-sm mb-2" placeholder="Description"
                        value={proj.description || ""} onChange={(e) => updateList("projects", i, "description", e.target.value)} />
                      <input className="block w-full bg-transparent text-xs text-blue-500 outline-none" placeholder="Project Link (http://...)"
                        value={proj.link || ""} onChange={(e) => updateList("projects", i, "link", e.target.value)} />
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center">
            <button onClick={downloadZip} disabled={genLoading}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center gap-3 w-full max-w-md justify-center">
              {genLoading ? <RefreshCw className="animate-spin" /> : <Download />}
              {genLoading ? "Packaging Portfolio..." : "Download React Codebase"}
            </button>
            <p className="mt-3 text-xs text-gray-500">Includes React source code, pre-configured Tailwind, and your data JSON.</p>
          </div>

        </motion.div>
      )}
    </div>
  );
}
