import { FileText, Upload, Sparkles, ChevronRight } from "lucide-react";

export default function Sidebar({ isOpen, onUploadClick, uploadedDoc }) {
  return (
    <aside className={`sidebar ${isOpen ? "" : "closed"}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={18} color="white" />
        </div>
        <span className="logo-text">Doc<span>Talk</span></span>
      </div>

      {/* Upload CTA */}
      <button className="sidebar-upload-btn" onClick={onUploadClick}>
        <Upload size={15} />
        Upload PDF
      </button>

      {/* Documents Section */}
      <div className="sidebar-section-label">Documents</div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {uploadedDoc ? (
          <div className="doc-item">
            <div className="doc-item-icon">
              <FileText size={15} color="var(--text-accent)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="doc-item-name">{uploadedDoc}</div>
              <div className="doc-item-size">Active document</div>
            </div>
            <ChevronRight size={14} color="var(--text-muted)" style={{ marginLeft: "auto", flexShrink: 0 }} />
          </div>
        ) : (
          <p className="sidebar-empty">
            Upload a PDF to get started. DocTalk will let you ask questions and extract insights instantly.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            background: "var(--bg-hover)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>User</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Free plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}