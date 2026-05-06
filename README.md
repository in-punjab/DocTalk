# 🚀 DocTalk — Chat with Your Documents using AI

DocTalk is a full-stack AI-powered application that allows users to upload PDFs and interact with them conversationally. It uses a Retrieval-Augmented Generation (RAG) pipeline to deliver accurate, context-aware responses grounded in document content.

## Live Demo: doc-talk-qgbmtgbbw-in-punjabs-projects.vercel.app

---

## 🧠 Core Idea

> Upload PDFs → Convert text into embeddings → Store in vector DB → Ask questions → Get AI responses based on your document

---

## ✨ Features

* 📄 Upload and process PDF documents
* 🧠 AI-powered question answering (RAG pipeline)
* 🔍 Semantic search using vector embeddings
* 💬 Real-time chat interface
* 📚 Source attribution (see supporting document chunks)
* 🌙 Modern ChatGPT-like UI (React + Tailwind)
* ⚡ Fast similarity search using pgvector

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Multer (memory storage for production-safe uploads)
* pdf-parse

### AI & Data

* Gemini API → Embeddings
* Groq API → Chat completion (LLM responses)
* PostgreSQL (Supabase)
* pgvector → Vector similarity search

### Deployment

* Frontend → Vercel
* Backend → Render
* Database → Supabase

---

## 🧩 System Architecture (RAG Pipeline)

```id="arch1"
User Uploads PDF
        ↓
Text Extraction (pdf-parse)
        ↓
Chunking (overlapping text)
        ↓
Embeddings (Gemini API)
        ↓
Store in PostgreSQL (pgvector)
        ↓
User Question
        ↓
Query Embedding (Gemini)
        ↓
Similarity Search (Top-K chunks)
        ↓
Context + Question
        ↓
Groq LLM (Chat Response)
        ↓
Answer + Sources
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash id="git1"
git clone https://github.com/YOUR_USERNAME/doctalk.git
cd doctalk
```

---

### 2️⃣ Backend Setup

```bash id="back1"
cd server
npm install
```

Create `.env` file:

```env id="env1"
PORT=5000

GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Run backend:

```bash id="run1"
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash id="front1"
cd client
npm install
npm run dev
```

---

## 🌐 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* Database hosted on Supabase

Update API base URL:

```bash id="api1"
client/src/services/api.js
```

---

## 🧪 Usage

1. Upload a PDF
2. Wait for processing (embedding + storage)
3. Ask questions in chat
4. View answers with source context

---

## 🧠 Key Concepts Used

* Retrieval-Augmented Generation (RAG)
* Vector Embeddings (Gemini)
* Semantic Search (pgvector)
* Context Injection into LLM (Groq)
* Chunking Strategy with Overlap
* Full-stack Deployment

---

## 🚧 Challenges Faced

* Handling large PDF ingestion efficiently
* Implementing vector similarity search in PostgreSQL
* Fixing file upload issues in cloud (memory vs disk storage)
* Debugging production errors (500 / 404 on Render)
* Tailwind + Vite configuration issues
* Managing API integrations (Gemini + Groq)

---

## 📈 Future Improvements

* Multi-document support (document-level filtering)
* Authentication system (JWT / OAuth)
* Chat history persistence
* Streaming responses (real-time typing like ChatGPT)
* Highlight relevant text in sources
* Drag & drop upload UI

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---
