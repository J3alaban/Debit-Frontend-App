import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

export interface ProductSlice {
  allProducts: Product[];
  newProducts: Product[];
  featuredProducts: Product[];
  wishlist: Product[];
  categories: Category[];
}

const initialState: ProductSlice = {
  allProducts: [],
  newProducts: [],
  featuredProducts: [],
  wishlist: [],
  categories: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProducts: (state, action: PayloadAction<Product[]>) => {
      state.allProducts = action.payload;
    },
    updateNewList: (state, action: PayloadAction<Product[]>) => {
      state.newProducts = action.payload;
    },
    updateFeaturedList: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      // Aynı ürün tekrar eklenmesin
      if (!state.wishlist.some(p => p.id === action.payload.id)) {
        state.wishlist.push(action.payload);
      }
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.wishlist = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const {
  addProducts,
  updateNewList,
  updateFeaturedList,
  addToWishlist,
  setWishlist,
  setCategories,
} = productSlice.actions;

export default productSlice.reducer;