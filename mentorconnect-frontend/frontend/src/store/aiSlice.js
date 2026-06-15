import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiApi } from "../services/apiService";

export const fetchRecommendations = createAsyncThunk("ai/recommend", async (studentProfile) => {
  const { data } = await aiApi.recommend(studentProfile);
  return data;
});

export const fetchFlagStatus = createAsyncThunk("ai/flagStatus", async (userId) => {
  const { data } = await aiApi.flags(userId);
  return data;
});

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    recommended: [], flagStatus: null,
    onboardingDone: false, loading: false,
  },
  reducers: {
    setOnboardingDone(state) { state.onboardingDone = true; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending,   (s) => { s.loading = true; })
      .addCase(fetchRecommendations.fulfilled, (s, { payload }) => { s.loading = false; s.recommended = payload; })
      .addCase(fetchFlagStatus.fulfilled,      (s, { payload }) => { s.flagStatus = payload; });
  },
});

export const { setOnboardingDone } = aiSlice.actions;
export default aiSlice.reducer;
