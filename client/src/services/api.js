import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload", formData);
};

export const sendMessage = (question, documentId) => {
  return API.post("/chat", { question, documentId });
};