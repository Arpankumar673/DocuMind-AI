import axios from "axios";

// Connect to the backend
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "",
  headers: {
    "Authorization": `Bearer ${import.meta.env.VITE_AUTH_SECRET || ""}`
  },
});

// Upload and analyze logic
export const analyzeDocument = async (file) => {
  const data = new FormData();
  data.append("file", file);

  try {
    const res = await api.post("/analyze-document", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("API call failed:", err.message);
    throw err;
  }
};

export default api;
