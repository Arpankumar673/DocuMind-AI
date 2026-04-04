# 🧠 DocuMind AI
### *Transforming unstructured documents into structured intelligence*

DocuMind AI is an intelligent document analysis and extraction system designed to bridge the gap between static files and actionable data. Whether it's a receipt, an invoice, or a professional report, DocuMind AI processes the content to deliver meaningful insights in a structured format.

---

## 🎯 Overview
DocuMind AI simplifies the way businesses and individuals interact with their documents. By utilizing advanced extraction logic, the system performs the following:
*   **Accepts Documents**: Supports PDF, Images (OCR), and Text files.
*   **Extracts Information**: Pulls out critical data points automatically.
*   **Generates Summaries**: Produces high-quality, professional executive summaries.
*   **Structured Output**: Returns data in a clean, developer-friendly JSON format.

---

## ✨ Features
*   **Smart Document Analysis**: Comprehensive processing of multiple file types.
*   **Executive Summaries**: AI-driven, human-readable summaries that capture the essence of the document.
*   **Entity Extraction**: Automated detection of **Names**, **Dates**, and **Currency Amounts**.
*   **Sentiment Analysis**: Intelligence to detect the tone (Positive, Negative, Neutral) of the content.
*   **Secure API Architecture**: Protected by robust `x-api-key` header-based authentication.
*   **Failure-Proof Logic**: Built-in fallbacks to handle messy OCR text or missing file fields gracefully.

---

## 🛠️ Tech Stack
*   **Backend**: Node.js, Express.js
*   **File Handling**: Multer (Memory Storage)
*   **OCR & Processing**: Tesseract.js, PDF-Parse, Mammoth
*   **Deployment**: Vercel / Render
*   **API Testing**: Postman / Insomnia

---

## 🏗️ System Architecture
The system follows a streamlined pipeline to ensure speed and accuracy:
`Upload` ➡️ `Validate (Auth & MIME)` ➡️ `Process (Buffer Extraction)` ➡️ `Extract (Rule-based Analysis)` ➡️ `JSON Response`

---

## 🚀 API Endpoint

### **POST** `/analyze-document`

**Headers:**
```http
Content-Type: multipart/form-data
x-api-key: arpan-secret-key
```

**Parameters:**
*   `file`: The document file (PDF, PNG, JPG, or DOCX).

---

## 📦 Sample Response
```json
{
  "fileName": "invoice_789.pdf",
  "summary": "This invoice originates from TechSolutions Inc, dated 15/04/2026. It effectively outlines a transaction for high-end server equipment and consulting services. The document reflects a standard billing process and is marked as paid.",
  "entities": {
    "names": ["Alice Johnson", "TechSolutions Inc"],
    "dates": ["15/04/2026"],
    "amounts": ["$5,400.00", "$1,200.00"]
  },
  "sentiment": "positive"
}
```

---

## ⚙️ Setup Instructions
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/documind-ai.git
    cd documind-ai
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add:
    ```env
    PORT=5000
    AUTH_SECRET=your-secret-key
    ```
4.  **Run the Server**:
    ```bash
    npm start
    ```

---

## 🌐 Deployment
*   **Backend**: Hosted on Render/Vercel for high availability.
*   **Live API**: Accessible via the provided public URL in the hackathon submission.

---

## 🧩 Challenges & Solutions
*   **Empty File Uploads**: Implemented "Omni-Channel" detection to find files in `req.file`, `req.files`, and `req.body` simultaneously.
*   **OCR Noise**: Created a sanitization pipeline to strip out dashed lines (`----`) and symbols before generating the summary.
*   **API Resilience**: Developed a smart recovery system that returns a structured "fallback" response instead of a 400 error when files are missing.

---

## ⚠️ Known Limitations
*   Complex multi-column layouts might slightly affect extraction sequence.
*   Basic NLP processing used for entity detection (optimized for speed over deep semantic depth).

---

## 🗺️ Future Improvements
*   **Advanced AI Models**: Integration with LLMs for deeper contextual understanding.
*   **Multi-Language Support**: Expanding OCR capabilities to non-English documents.
*   **Interactive Dashboard**: A React-based frontend for real-time analysis visualization.
*   **SaaS Model**: User accounts, usage history, and API usage analytics.

---

## 🤖 AI Tools Used
*   **ChatGPT**: Provided guidance on architectural patterns and optimized documentation structure.
*   **GitHub Copilot**: Assisted in streamlining repetitive boilerplate code.

---
