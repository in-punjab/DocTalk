import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import UploadModal from "./components/UploadBox";
import { sendMessage } from "./services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const res = await sendMessage(text);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.answer, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again.", timestamp: new Date(), isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (fileName) => {
    setUploadedDoc(fileName);
    setShowUpload(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: `📄 **${fileName}** has been uploaded and processed. You can now ask me anything about this document!`,
        timestamp: new Date(),
        isSystem: true,
      },
    ]);
  };

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onUploadClick={() => setShowUpload(true)}
        uploadedDoc={uploadedDoc}
      />

      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <ChatWindow messages={messages} isLoading={isLoading} uploadedDoc={uploadedDoc} />
        <InputBox onSend={handleSend} isLoading={isLoading} uploadedDoc={uploadedDoc} />
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}

export default App;