# DocTalk — Chat with Your Documents

> AI-powered document Q&A using a full RAG pipeline

**Live Demo:** [doc-talk-qgbmtgbbw-in-punjabs-projects.vercel.app](https://doc-talk-qgbmtgbbw-in-punjabs-projects.vercel.app)

---

## What is DocTalk?

DocTalk lets you upload any PDF and have a natural conversation with it. Under the hood, it runs a complete **Retrieval-Augmented Generation (RAG)** pipeline — your document is chunked, embedded into vectors, stored in a PostgreSQL database, and retrieved semantically at query time to ground the LLM's response in real content.

No hallucinations. No guessing. Just answers from your document.

---

## Features

- Upload and process PDF documents
- AI-powered Q&A using a RAG pipeline
- Semantic search via vector embeddings (pgvector)
- Real-time chat interface with ChatGPT-like UX
- Source attribution — see the exact chunks the answer came from
- Clean, responsive UI built with React + Tailwind CSS
- Fast similarity search using PostgreSQL + pgvector

---

## Screenshots
![App Screenshots](<img width="1920" height="912" alt="Image" src="https://github.com/user-attachments/assets/769d0123-f31a-4d2b-8bf0-3773231f38df" />)
![App Screenshots](<img width="1920" height="900" alt="Image" src="https://github.com/user-attachments/assets/52876ef0-b673-4c7a-831e-404dfe9e99d6" />)
![App Screenshots](<img width="1920" height="897" alt="Image" src="https://github.com/user-attachments/assets/71ab4a5b-747f-45e5-8691-a4b4cd546443" />)
![App Screenshots](<img width="1920" height="902" alt="Image" src="https://github.com/user-attachments/assets/f2a7df88-df05-492a-be18-acbdfb2fdee0" />)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Multer, pdf-parse |
| Embeddings | Gemini API |
| LLM | Groq API |
| Database | PostgreSQL via Supabase + pgvector |
| Deployment | Vercel (frontend), Render (backend), Supabase (DB) |

---

## RAG Pipeline

```
PDF Upload
    → Text Extraction       (pdf-parse)
    → Chunking              (overlapping sliding window)
    → Embedding             (Gemini Embeddings API)
    → Vector Storage        (PostgreSQL + pgvector)

User Question
    → Query Embedding       (Gemini)
    → Similarity Search     (Top-K chunks via pgvector)
    → Context + Prompt      (injected into LLM)
    → Groq LLM Response
    → Answer + Sources      (returned to user)
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/doctalk.git
cd doctalk
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Start the dev server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

> Update the API base URL in `client/src/services/api.js` before deploying.

---

## Usage

1. Open the app and upload a PDF
2. Wait for processing (text extraction → embedding → storage)
3. Ask any question about your document in the chat
4. View the AI response alongside the source chunks it referenced

---

## Architecture Decisions

**Why Gemini for embeddings + Groq for inference?**
Gemini's `text-embedding-004` model produces high-quality dense vectors well-suited for semantic search. Groq's inference is fast (low latency LLM calls) — separating embedding and generation lets us optimize each independently.

**Why pgvector over a dedicated vector DB?**
Keeping vectors in PostgreSQL via Supabase reduces infrastructure complexity. For the scale this project targets, pgvector's HNSW index gives excellent similarity search performance without adding a separate service like Pinecone or Weaviate.

**Why memory storage for file uploads (Multer)?**
Render's ephemeral filesystem means disk writes don't persist across deploys. Using Multer's in-memory storage keeps uploads stateless and production-safe.

---

## Challenges & What I Learned

- **Large PDF ingestion** — chunking strategy matters a lot. Overlapping chunks prevent context from being split across boundaries.
- **pgvector setup** — enabling the extension in Supabase and writing the cosine similarity query required careful schema design.
- **Cloud file handling** — disk storage works locally but breaks on Render; switching to memory storage fixed production upload failures.
- **API debugging** — managing two external APIs (Gemini + Groq) with proper error handling and rate limit awareness in the same request lifecycle.
- **Tailwind + Vite config** — PostCSS config conflicts required careful resolution during initial setup.

---

## Roadmap

- [ ] Multi-document support with document-level filtering
- [ ] JWT / OAuth authentication
- [ ] Streaming responses (real-time token streaming)
- [ ] Chat history persistence per user/session
- [ ] Highlight matching source text in the PDF viewer
- [ ] Drag & drop upload with progress indicator

---

## Project Structure

```
doctalk/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Chat UI, upload, source viewer
│   │   ├── services/        # Axios API client
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── routes/              # Upload + query endpoints
│   ├── utils/               # PDF parsing, chunking, embedding
│   ├── db/                  # pgvector queries
│   └── index.js
│
└── README.md
```

---

## Local Development Notes

- Backend runs on `http://localhost:5000`
- Frontend proxies API calls via Vite config
- Make sure pgvector extension is enabled in your Supabase project (`CREATE EXTENSION vector;`)
- Gemini and Groq both require free API keys — links in `.env` comments

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT

---

*Built with Node.js, React, PostgreSQL, and the Gemini + Groq APIs.*  
*If this helped you understand RAG pipelines, consider giving it a ⭐*
