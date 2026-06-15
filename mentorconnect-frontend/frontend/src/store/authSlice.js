import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const loginThunk = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    localStorage.setItem("mc-token", data.token);
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Login failed"); }
});

export const registerThunk = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/auth/register`, payload);
    localStorage.setItem("mc-token", data.token);
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Registration failed"); }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    token:   localStorage.getItem("mc-token") || null,
    role:    null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.role = null;
      localStorage.removeItem("mc-token");
    },
    setUser(state, { payload }) { state.user = payload; state.role = payload.role; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending,      (s) => { s.loading = true;  s.error = null; })
      .addCase(loginThunk.fulfilled,    (s, { payload }) => {
        s.loading = false; s.token = payload.token;
        s.user = payload.user; s.role = payload.user.role;
      })
      .addCase(loginThunk.rejected,     (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(registerThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerThunk.fulfilled, (s, { payload }) => {
        s.loading = false; s.token = payload.token;
        s.user = payload.user; s.role = payload.user.role;
      })
      .addCase(registerThunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
