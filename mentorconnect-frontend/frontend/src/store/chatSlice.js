import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../services/apiService";

export const fetchHistory = createAsyncThunk("chat/fetchHistory", async (userId) => {
  const { data } = await chatApi.history(userId);
  return data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], activePeer: null,
    connected: false, unread: 0,
  },
  reducers: {
    setActivePeer(state, { payload }) { state.activePeer = payload; state.unread = 0; },
    addMessage(state, { payload })    { state.messages.push(payload); },
    setConnected(state, { payload })  { state.connected = payload; },
    incrementUnread(state)            { state.unread += 1; },
    clearMessages(state)              { state.messages = []; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.fulfilled, (s, { payload }) => { s.messages = payload; });
  },
});

export const { setActivePeer, addMessage, setConnected, incrementUnread, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
