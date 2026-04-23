import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  totalItems: JSON.parse(localStorage.getItem("cart"))?.length || 0,
  totalPrice: JSON.parse(localStorage.getItem("cart"))?.reduce((acc, item) => acc + item.price, 0) || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const exists = state.cart.find((item) => item._id === course._id);
      if (exists) {
        toast.error("Course already in cart");
        return;
      }
      state.cart.push(course);
      state.totalItems++;
      state.totalPrice += course.price;
      localStorage.setItem("cart", JSON.stringify(state.cart));
      toast.success("Added to cart");
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);
      if (index >= 0) {
        state.totalPrice -= state.cart[index].price;
        state.totalItems--;
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
        toast.success("Removed from cart");
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
