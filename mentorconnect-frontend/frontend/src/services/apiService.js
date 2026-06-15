import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ── Axios instance with JWT auto-attach ── */
export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mc-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* ── authApi ── */
export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login:    (payload) => api.post("/api/auth/login", payload),
  me:       ()        => api.get("/api/auth/me"),
};

/* ── mentorApi ── */
export const mentorApi = {
  search:       (filters) => api.get("/api/mentors/search", { params: filters }),
  getById:      (id)      => api.get(`/api/mentors/${id}`),
  update:       (payload) => api.put("/api/mentors/profile", payload),
  leaderboard:  ()        => api.get("/api/mentors/leaderboard"),
};

/* ── chatApi ── */
export const chatApi = {
  history:  (userId) => api.get(`/api/chat/history/${userId}`),
  sendFile: (form)   => api.post("/api/chat/file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

/* ── aiApi ── */
export const aiApi = {
  recommend:    (profile) => api.post("/api/ai/recommend", profile),
  flags:        (userId)  => api.get(`/api/ai/flags/${userId}`),
  reportMentor: (payload) => api.post("/api/ai/report-mentor", payload),
};

/* ── resumeApi ── */
export const resumeApi = {
  upload:      (form)        => api.post("/api/resumes/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  grade:       (id, payload) => api.post(`/api/resumes/${id}/grade`, payload),
  getFeedback: (studentId)   => api.get("/api/resumes/feedback", { params: { studentId } }),
};

/* ── doubtApi ── */
export const doubtApi = {
  create:  (payload)      => api.post("/api/doubts", payload),
  list:    (mentorId)     => api.get("/api/doubts", { params: { mentorId } }),
  resolve: (id, answer)   => api.put(`/api/doubts/${id}/resolve`, { answer }),
  mine:    ()             => api.get("/api/doubts/mine"),
};

/* ── notificationApi ── */
export const notificationApi = {
  getAll:   () => api.get("/api/notifications"),
  markRead: () => api.put("/api/notifications/read"),
};
