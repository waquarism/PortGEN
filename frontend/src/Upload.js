import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileUp, FileText, Download } from "lucide-react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (e) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async () => {
    const res = await axios.get(`http://localhost:8000/generate/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}_portfolio.zip`;
    a.click();
  };

  return (
    <div className="mt-8 flex flex-col items-center">

      {/* Upload Box */}
      <div className="w-full max-w-xl p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-center transition">
        <FileUp size={40} className="mx-auto mb-4 text-gray-500 dark:text-gray-400" />

        <p className="font-semibold mb-2">Upload your resume</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Supported formats: PDF, DOCX
        </p>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm"
        />

        <button
          onClick={upload}
          disabled={loading}
          className="mt-6 px-6 py-3 w-full bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Processing..." : "Generate Portfolio"}
        </button>
      </div>

      {/* Preview Section */}
      {preview && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="mt-10 w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
        >
          <div className="flex items-center mb-3">
            <FileText size={24} className="mr-2 text-blue-600" />
            <h3 className="text-xl font-bold">{preview.name}</h3>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">{preview.summary}</p>

          <h4 className="font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {preview.skills?.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                {s}
              </span>
            ))}
          </div>

          <button
            onClick={downloadZip}
            className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Download size={18} /> Download Portfolio ZIP
          </button>
        </motion.div>
      )}
    </div>
  );
}
