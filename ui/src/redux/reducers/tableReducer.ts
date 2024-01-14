import { createSlice } from "@reduxjs/toolkit";

interface TableBehaviourState {
    refresh: boolean;
    department?: string;
    testing?: string;
}

const initialState: TableBehaviourState = {
  refresh: false
};

export const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        tableRefresh: (state) => {
          const newState = !state.refresh;
          state.refresh = newState;
        },
        saveDepartment: (state, action) => {
          state.department = action.payload
          
        },
        saveTesting: (state, action) => {
          state.testing = action.payload 
        }
    },
});

export const { tableRefresh, saveDepartment, saveTesting } = tableSlice.actions;

export default tableSlice.reducer;
