// ===================== DELETE EARNING THUNK ===========================
export const deleteEarning = createAsyncThunk(
  "deleteEarning",
  async (earningId) => {
    const res = await fetch(`http://localhost:3000/earnings/${earningId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed deleting earning record");
    return { earningId };
  }
);

// ===================== UPDATE EARNING THUNK ===========================
export const updateEarning = createAsyncThunk(
  "updateEarning",
  async ({ earningId, formData }) => {
    const res = await fetch(`http://localhost:3000/earnings/${earningId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed updating earning record");
    return data.earning;
  }
);
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const addEarning = createAsyncThunk(
  "addEarning",
  async (formData) => {
    const res = await fetch("http://localhost:3000/earnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed creating earning record");
    return data;
  }
);

export const getEarnings = createAsyncThunk(
  "getEarnings",
  async ({ page = 1, limit = 5, category = "", sort = "date_desc" } = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      category,
      sort
    });
    const res = await fetch(
      `http://localhost:3000/earnings?${params.toString()}`,
      { method: "GET", credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed fetching earning records");
    return data;
  }
);


const earningSlice = createSlice({
  name: "earning",
  initialState: {
    earnings: [],
    loadingEarnings: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalEarnings: 0,
    limit: 5,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  // --------------- Add Earning Thunk reducers -----------------
      // --------------- Delete Earning Thunk reducers -----------------
      .addCase(deleteEarning.fulfilled, (state, action) => {
        state.earnings = state.earnings.filter(earn => earn._id !== action.payload.earningId);
        state.totalEarnings = Math.max(0, state.totalEarnings - 1);
      })
      .addCase(deleteEarning.rejected, (state, action) => {
        state.error = action.error.message || "Error deleting earning";
      })

      // --------------- Update Earning Thunk reducers -----------------
      .addCase(updateEarning.fulfilled, (state, action) => {
        state.earnings = state.earnings.map(earn => earn._id === action.payload._id ? action.payload : earn);
      })
      .addCase(updateEarning.rejected, (state, action) => {
        state.error = action.error.message || "Error updating earning";
      })
      .addCase(addEarning.pending, (state) => {
        state.loadingEarnings = true;
        state.error = null;
      })
      .addCase(addEarning.fulfilled, (state, action) => {
        state.loadingEarnings = false;
        if (action.payload?.earning) {
          state.earnings.unshift(action.payload.earning);
          state.totalEarnings += 1;
        }
      })
      .addCase(addEarning.rejected, (state, action) => {
        state.loadingEarnings = false;
        state.error = action.error.message || "Error adding earning to DB";
      })

      // --------------- Fetch Eaarning Thunk reducers -----------------
      .addCase(getEarnings.pending, (state) => {
        state.loadingEarnings = true;
        state.error = null;
      })
      .addCase(getEarnings.fulfilled, (state, action) => {
        state.loadingEarnings = false;
        state.earnings = action.payload.earnings;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalEarnings = action.payload.totalEarnings;
      })
      .addCase(getEarnings.rejected, (state, action) => {
        state.loadingEarnings = false;
        state.error = action.error.message || "Error fetching earnings";
      });
  },
});

export default earningSlice.reducer;
