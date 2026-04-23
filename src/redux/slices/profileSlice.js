import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    updateUserImage: (state, action) => {
      if (state.user) {
        state.user.image = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, setLoading, updateUserImage } = profileSlice.actions;
export default profileSlice.reducer;
