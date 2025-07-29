// src/utils/axios.js or similar (React frontend)
import axios from "axios";

export const BASE_URL = "http://localhost:9090";

const clientServer = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default clientServer;
