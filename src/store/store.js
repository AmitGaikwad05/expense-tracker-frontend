import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import expenseSlice from "./expenseSlice";
import earningSlice from "./earningSlice";
import dashboardSlice from "./dashboardSlice"

const MyStore = configureStore({
    reducer:{
        auth: authSlice,
        expense: expenseSlice,
        earning: earningSlice,
        dashboard: dashboardSlice
    }
})

export default MyStore;