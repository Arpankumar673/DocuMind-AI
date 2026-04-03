# 🧠 DocuMind AI – Intelligent Document Analysis System

DocuMind AI is a full-stack document intelligence platform that extracts text from PDFs and images, analyzes content using AI, and returns structured insights including summaries, key entities, and sentiment.

---

## 🚀 Features
- **File Support**: PDF, JPG, PNG (Max 5MB).
- **OCR Extraction**: Powered by Tesseract.js for high-accuracy image text extraction.
- **PDF Parsing**: Direct text extraction from PDF layers.
- **AI Analysis**: Deep integration with **OpenRouter API** (GPT-3.5) for structured JSON output.
- **Premium UI**: Modern React interface with Framer Motion animations and glassmorphism.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Deployment**: Vercel (Frontend) + Render (Backend).

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **NPM**
- **OpenRouter API Key** ([Get it here](https://openrouter.ai/))

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env from .env.example and add your keys
cp .env.example .env
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env from .env.example and configure VITE_AUTH_SECRET
cp .env.example .env
npm run dev
```

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Build Command: `cd backend && npm install`
2. Start Command: `cd backend && node server.js`
3. Env Vars: `OPENROUTER_API_KEY`, `AUTH_SECRET`, `PORT=5000`

### Frontend (Vercel)
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Env Vars: `VITE_BACKEND_URL`, `VITE_AUTH_SECRET`

---

## 📂 Project Structure
- `backend/`: Express server and AI utility.
- `frontend/`: React components and styles.
- `.env.example`: Template for environment variables.
- `README.md`: Project guide.

---

## ✅ Deliverables
- [x] Full-stack source code (Clean & Secure).
- [x] Document extraction pipeline (PDF/OCR).
- [x] OpenRouter AI integration with Environment variables.
- [x] Premium mobile-responsive UI.
- [x] Detailed setup guide.
