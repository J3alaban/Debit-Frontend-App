import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 // import { AuthSlice } from "../models/AuthSlice";

interface AuthState {
  isLoggedIn: boolean;
  modalOpen: boolean;
  username: string;
  role: string | null; // Role bilgisini ekledik
}

interface LoginProps {
  email: string;
  role: string; // Login olduğunda gelen rol bilgisi
}



const initialState: AuthState = {
  // Sadece username değil, token varsa giriş yapmış sayalım
  isLoggedIn: !!localStorage.getItem("token"),
  modalOpen: false,
  username: localStorage.getItem("username") ?? "",
  role: localStorage.getItem("role") ?? null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    doLogin: (state, action: PayloadAction<LoginProps>) => {
      localStorage.setItem("username", action.payload.email);
      localStorage.setItem("role", action.payload.role);
      
      state.username = action.payload.email;
      state.role = action.payload.role;
      state.isLoggedIn = true;
      state.modalOpen = false;
    },
    doLogout: (state) => {
      localStorage.clear(); // Hepsini temizlemek en güvenlisi
      state.username = "";
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const { updateModal, doLogin, doLogout } = authSlice.actions;
export default authSlice.reducer;