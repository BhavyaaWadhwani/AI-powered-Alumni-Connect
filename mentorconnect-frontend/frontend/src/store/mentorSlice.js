import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mentorApi } from "../services/apiService";

export const fetchMentors = createAsyncThunk("mentor/fetchAll", async (filters = {}) => {
  const { data } = await mentorApi.search(filters);
  return data;
});

export const fetchMentorById = createAsyncThunk("mentor/fetchById", async (id) => {
  const { data } = await mentorApi.getById(id);
  return data;
});

const mentorSlice = createSlice({
  name: "mentor",
  initialState: {
    list: [], selectedMentor: null,
    filters: {}, aiRecommended: [],
    loading: false, error: null,
  },
  reducers: {
    setFilters(state, { payload })       { state.filters = payload; },
    setAiRecommended(state, { payload }) { state.aiRecommended = payload; },
    clearSelected(state)                 { state.selectedMentor = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending,      (s) => { s.loading = true; })
      .addCase(fetchMentors.fulfilled,    (s, { payload }) => { s.loading = false; s.list = payload; })
      .addCase(fetchMentors.rejected,     (s) => { s.loading = false; })
      .addCase(fetchMentorById.fulfilled, (s, { payload }) => { s.selectedMentor = payload; });
  },
});

export const { setFilters, setAiRecommended, clearSelected } = mentorSlice.actions;
export default mentorSlice.reducer;
