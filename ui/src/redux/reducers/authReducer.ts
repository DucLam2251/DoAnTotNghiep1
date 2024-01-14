import { createSlice } from "@reduxjs/toolkit";
import { Role } from "../../app/model/enum/auth";

interface CurrentUserState {
    role: Role | null;
    email: string | null;
    info: any;
}

const initialState: CurrentUserState = {
    role: null,
    email: null,
    info: {},
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setInfoUser: (state, action) => {
            const oldInfo = state.info
            state.info = { ...oldInfo, ...action.payload}
        },
        userLogout: (state) => {
            state.role = null,
            state.email = null,
            state.info = null
        }
    }
})

export const { setRole, setEmail, setInfoUser, userLogout } = authSlice.actions;

export default authSlice.reducer;