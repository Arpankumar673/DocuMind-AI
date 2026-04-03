## 🧠 DocuMind AI – Document Analysis System

DocuMind AI is a full-stack application that allows users to upload documents like PDFs or images and get useful insights from them.

It extracts text from the file, processes it, and returns:

* A short summary
* Important details like names, dates, and amounts
* Overall sentiment of the document

---

## 🚀 Features

* Supports PDF, JPG, PNG (up to 50MB)
* Extracts text from PDFs and images
* Uses OCR for scanned documents
* Returns structured JSON output
* Simple and clean user interface

---

## 🛠️ Tech Stack

* Frontend: React, Tailwind CSS
* Backend: Node.js, Express
* OCR: Tesseract.js
* AI Processing: OpenRouter API
* Deployment: Vercel (frontend), Render (backend)

---

## 🛠️ Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)

* Build: `cd backend && npm install`
* Start: `cd backend && node server.js`

### Frontend (Vercel)

* Root: `frontend`
* Build: `npm run build`
* Output: `dist`

---

## 📂 Structure

* backend/ → API and processing
* frontend/ → UI
* .env.example → environment variables

---

## ✅ What this project does

* Upload a document
* Extract text
* Analyze content
* Return structured insights
