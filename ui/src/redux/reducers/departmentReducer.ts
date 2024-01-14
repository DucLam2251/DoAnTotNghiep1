import { createSlice } from "@reduxjs/toolkit";

interface DepartmentState {
  departmentId: string
}

const initialState: DepartmentState = {
  departmentId: ""
};

export const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        setDepartmentCurrent: (state, action) => {
            state.departmentId = action.payload;
        },
    },
});

export const { setDepartmentCurrent } = departmentSlice.actions;

export default departmentSlice.reducer;