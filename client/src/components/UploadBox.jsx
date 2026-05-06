import { useState } from "react";
import { uploadPDF } from "../services/api";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadModal({ onClose, onSuccess }) {
  const [status, setStatus] = useState(null); // null | 'processing' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("error");
      setStatusMsg("Only PDF files are supported.");
      return;
    }

    setSelectedFile(file);
    setStatus("processing");
    setStatusMsg(`Processing "${file.name}"…`);

    try {
      await uploadPDF(file);
      setStatus("success");
      setStatusMsg(`"${file.name}" uploaded successfully!`);
      setTimeout(() => onSuccess?.(file.name), 1000);
    } catch {
      setStatus("error");
      setStatusMsg("Upload failed. Please try again.");
    }
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">Upload Document</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          className={`dropzone ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            disabled={status === "processing"}
          />
          <div className="dropzone-icon">
            {selectedFile ? (
              <FileText size={22} color="var(--text-accent)" />
            ) : (
              <Upload size={22} color="var(--text-accent)" />
            )}
          </div>
          <div className="dropzone-title">
            {dragOver ? "Drop your PDF here" : "Drag & drop your PDF"}
          </div>
          <div className="dropzone-sub" style={{ marginTop: 4 }}>
            or <span style={{ color: "var(--text-accent)", textDecoration: "underline" }}>browse files</span>
          </div>
          <div className="dropzone-sub" style={{ marginTop: 8, fontSize: 12 }}>
            PDF files only · Max 50MB
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className={`upload-status ${status}`}>
            {status === "processing" && <div className="spinner" />}
            {status === "success" && <CheckCircle size={14} />}
            {status === "error" && <AlertCircle size={14} />}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="modal-btn-row">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}