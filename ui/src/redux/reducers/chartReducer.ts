import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChartApi } from "../../api";
import { OrderChart, PromiseStatus } from "../../app/model/enum/common";
import { IBodyChart } from "../../utils";
import { formatDateToISOString } from "../../utils/function";

export interface IChartData {
    count: number | string;
    name: string;
}


export interface IChartPayment {
    data: IChartData[]
    status: PromiseStatus
    filterInfo: IBodyChart
}

export interface IChartState {
    chartPayment: IChartPayment;
    chartNumberDepartment: IChartPayment
    chartNumberAppointment: IChartPayment;
}

const initialState: IChartState = {
    chartPayment: {
        data: [],
        status: PromiseStatus.None,
        filterInfo: {
            order: OrderChart.Day,
            date: formatDateToISOString(new Date())
        }
    },
    chartNumberDepartment: {
        data: [],
        status: PromiseStatus.None,
        filterInfo: {
            order: OrderChart.Day,
            date: formatDateToISOString(new Date())
        }
    },
    chartNumberAppointment:{
        data: [],
        status: PromiseStatus.None,
        filterInfo: {
            order: OrderChart.Day,
            date: formatDateToISOString(new Date())
        }
    },
}


export const getChartPatmentAsync = createAsyncThunk(
    "datn/chartpayment",
    async (body: IBodyChart) => {
        const response = await ChartApi.getChartPayment(body)
        return response.data
    }
)
export const getChartTotalAppAsync = createAsyncThunk(
    "datn/chartpayment1",
    async (body: IBodyChart) => {
        const response = await ChartApi.getChartNumberDepartment(body)
        return response.data
    }
)
export const getChartTotalAppointmentAsync = createAsyncThunk(
    "datn/chartpayment2",
    async (body: IBodyChart) => {
        const response = await ChartApi.getChartNumberAppointment(body)
        return response.data
    }
)

export const chartSlice = createSlice({
    name: "chartSlice",
    initialState,
    reducers: {
        setFilterChartPayment: (state, action) => {
            state.chartPayment.filterInfo = {
                ...state.chartPayment.filterInfo,
                ...action.payload
            }
        },
        setFilterChartDepartment: (state,action) => {
            state.chartNumberDepartment.filterInfo = {
                ...state.chartNumberDepartment.filterInfo,
                ...action.payload
            }
        },
        setFilterChartAppointment: (state,action) => {
            state.chartNumberAppointment.filterInfo = {
                ...state.chartNumberAppointment.filterInfo,
                ...action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChartPatmentAsync.pending, (state) => {
                state.chartPayment.status = PromiseStatus.Loading
            })
            .addCase(getChartPatmentAsync.fulfilled, (state, action) => {
                state.chartPayment.status = PromiseStatus.Idle
                state.chartPayment.data = action.payload
            }).addCase(getChartPatmentAsync.rejected, (state) => {
                state.chartPayment.status = PromiseStatus.Failed
            })
            .addCase(getChartTotalAppAsync.pending, (state) => {
                state.chartNumberDepartment.status = PromiseStatus.Loading
            })
            .addCase(getChartTotalAppAsync.fulfilled, (state, action) => {
                state.chartNumberDepartment.status = PromiseStatus.Idle
                state.chartNumberDepartment.data = action.payload.values
            }).addCase(getChartTotalAppAsync.rejected, (state) => {
                state.chartNumberDepartment.status = PromiseStatus.Failed
            })
            .addCase(getChartTotalAppointmentAsync.pending, (state) => {
                state.chartNumberAppointment.status = PromiseStatus.Loading
            })
            .addCase(getChartTotalAppointmentAsync.fulfilled, (state, action) => {
                state.chartNumberAppointment.status = PromiseStatus.Idle
                state.chartNumberAppointment.data = action.payload
            }).addCase(getChartTotalAppointmentAsync.rejected, (state) => {
                state.chartNumberAppointment.status = PromiseStatus.Failed
            })
    },
})

export const {
    setFilterChartPayment,
    setFilterChartDepartment,
    setFilterChartAppointment
} = chartSlice.actions

export default chartSlice.reducer