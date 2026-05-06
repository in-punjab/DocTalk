import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ role, text, timestamp, isError, isSystem }) {
  const isUser = role === "user";

  const contentClass = [
    "msg-content",
    isUser ? "user" : "bot",
    isError ? "error" : "",
    isSystem ? "system" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`msg-row ${isUser ? "user" : "bot"}`}
    >
      <div className={`msg-avatar ${isUser ? "user" : "bot"}`}>
        {isUser ? "U" : "AI"}
      </div>

      <div className="msg-bubble">
        <div className={contentClass}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        {timestamp && (
          <div className="msg-time">{formatTime(timestamp)}</div>
        )}
      </div>
    </motion.div>
  );
}