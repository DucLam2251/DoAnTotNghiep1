import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
    isLoading: boolean
}

const initialState: LoadingState = {
    isLoading: false
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        openLoading: (state) => {
            state.isLoading = true;
        },
        closeLoading: (state) => {
            state.isLoading = false;
        }
    },
});

export const { openLoading, closeLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
