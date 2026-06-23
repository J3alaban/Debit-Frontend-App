import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
    isDarkMode: boolean;
    isLoading: boolean;
    searchQuery: string; // 1. Eyalet tipini buraya ekledik
}

const initialState: HomeState = {
    isDarkMode: false,
    isLoading: false,
    searchQuery: "", // 2. Başlangıç değerini boş string verdik
};

export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        updateDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        // 3. Navbar'dan dispatch edilen fonksiyonu buraya yazdık
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
    },
});

// 4. 🔥 CRITICAL: Hatanın ana sebebi burası; dışa aktarımı sağladık:
export const { updateDarkMode, updateLoading, setSearchQuery } = homeSlice.actions;

export default homeSlice.reducer;