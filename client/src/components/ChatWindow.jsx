import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { FileText, Upload, Zap, BookOpen, Search } from "lucide-react";

const SUGGESTIONS = [
  { icon: <BookOpen size={14} />, text: "Summarize this document" },
  { icon: <Search size={14} />, text: "What are the key findings?" },
  { icon: <Zap size={14} />, text: "List the main topics" },
  { icon: <FileText size={14} />, text: "Extract important dates" },
];

export default function ChatWindow({ messages, isLoading, uploadedDoc }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-title">
          {uploadedDoc ? "Chat" : "DocTalk AI"}
        </div>
        {uploadedDoc && (
          <div className="topbar-doc-badge">
            <FileText size={12} />
            <span>{uploadedDoc}</span>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Zap size={28} color="var(--text-accent)" />
            </div>
            <div className="empty-title">Ask anything about your PDF</div>
            <div className="empty-subtitle">
              {uploadedDoc
                ? `"${uploadedDoc}" is ready. Try one of the suggestions below or ask your own question.`
                : "Upload a PDF from the sidebar, then start asking questions. DocTalk will read, analyze, and answer instantly."}
            </div>

            {uploadedDoc && (
              <div className="empty-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="suggestion-chip">
                    {s.icon}
                    <span style={{ marginLeft: 6 }}>{s.text}</span>
                  </button>
                ))}
              </div>
            )}

            {!uploadedDoc && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                  padding: "10px 16px",
                  background: "var(--accent-glow)",
                  border: "1px solid var(--accent-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  color: "var(--text-accent)",
                }}
              >
                <Upload size={14} />
                Click "Upload PDF" in the sidebar to begin
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} {...msg} />
            ))}

            {isLoading && (
              <div className="msg-row">
                <div className="msg-avatar bot">AI</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </>
  );
}