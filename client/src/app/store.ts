import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import adminReducer from "../features/admin/admin.slice";
import attendantReducer from "../features/attendant/attendant.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    attendant: attendantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
