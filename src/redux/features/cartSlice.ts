import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../models/CartItem";
import { CartSlice } from "../../models/CartSlice";

const initialState: CartSlice = {
  cartOpen: false,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { cartItems } = state;
      if (cartItems.findIndex(pro => pro.id === action.payload.id) === -1) {
        return {
          ...state,
          cartItems: [...cartItems, { ...action.payload, quantity: 1 }],
        };
      } else {
        return {
          ...state,
          cartItems: cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: (item.quantity ?? 0) + 1 }
              : item
          ),
        };
      }
    },

    /** 👇 BACKEND'DEN GELEN SEPET İÇİN */
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      return { ...state, cartItems: action.payload };
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };
    },

    reduceFromCart: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item && item.quantity && item.quantity > 1) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === action.payload
              ? { ...i, quantity: i.quantity! - 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.id !== action.payload),
      };
    },

    setCartState: (state, action: PayloadAction<boolean>) => {
      return { ...state, cartOpen: action.payload };
    },

    emptyCart: (state) => {
      return { ...state, cartItems: [] };
    },
  },
});

export const {
  addToCart,
  setCartItems,
  removeFromCart,
  reduceFromCart,
  setCartState,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;

