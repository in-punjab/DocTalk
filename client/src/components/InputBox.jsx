import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

export default function InputBox({ onSend, isLoading, uploadedDoc }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = uploadedDoc
    ? `Ask anything about "${uploadedDoc}"…`
    : "Upload a PDF first, then ask questions…";

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
        />

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      <div className="input-hint">
        Press <strong>Enter</strong> to send &nbsp;·&nbsp; <strong>Shift + Enter</strong> for new line
      </div>
    </div>
  );
}