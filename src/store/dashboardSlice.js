import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ==================== FETCH DASHBOARD STATS THUNK ======================
export const fetchDashboardStats = createAsyncThunk("fetchStats", 
 async (formData) => {
    const res = await fetch("http://localhost:3000/dashboard/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed fetching dashboard stats record");
    return data; 
  });

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    noOfExpenses: 0,
    noOfEarnings: 0,
    totalExpenseAmt: 0,
    totalEarningAmt: 0,
    duration: {},
    expenses: [],
    earnings: [],
    dataset: [],
    loadingDashboardStats: true,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --------------Fetch Dashboard  stats Thunk reducers -----------------
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loadingDashboardStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
  state.loadingDashboardStats = false;
  state.error =  null;
  state.totalExpenseAmt = action.payload.totalExpenseAmt;
  state.totalEarningAmt = action.payload.totalEarningAmt;
  state.days= action.payload.date;
  state.expenses = action.payload.expenses;
  state.earnings = action.payload.earnings || [];
  state.noOfExpenses = action.payload.noOfExpenses;
  state.noOfEarnings = action.payload.noOfEarnings;
  state.dataset = action.payload.dataset || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loadingDashboardStats = false;
        state.error = action.error.message || "Error fetching dashboard stats";
      });
  },
});

export default dashboardSlice.reducer;
