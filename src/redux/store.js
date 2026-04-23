import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import courseReducer from "./slices/courseSlice";
import cartReducer from "./slices/cartSlice";
import viewCourseReducer from "./slices/viewCourseSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    cart: cartReducer,
    viewCourse: viewCourseReducer,
  },
});

export default store;
