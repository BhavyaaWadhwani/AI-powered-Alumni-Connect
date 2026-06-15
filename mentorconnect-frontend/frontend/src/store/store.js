import { configureStore } from "@reduxjs/toolkit";
import authReducer   from "./authSlice";
import mentorReducer from "./mentorSlice";
import chatReducer   from "./chatSlice";
import aiReducer     from "./aiSlice";

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    mentor: mentorReducer,
    chat:   chatReducer,
    ai:     aiReducer,
  },
});
