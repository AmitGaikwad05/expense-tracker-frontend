const API_URL = import.meta.env.VITE_SERVER_URI;

// ===================== DELETE EXPENSE THUNK ===========================
export const deleteExpense = createAsyncThunk(
  "deleteExpense",
  async (expenseId) => {
    const res = await fetch(`${API_URL}/expenses/${expenseId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed deleting expense record");
    return { expenseId };
  }
);

// ===================== UPDATE EXPENSE THUNK ===========================
export const updateExpense = createAsyncThunk(
  "updateExpense",
  async ({ expenseId, formData }) => {
    const res = await fetch(`${API_URL}/expenses/${expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed updating expense record");
    return data.expense;
  }
);
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===================== ADD EXPENSE THUNK ===========================
export const addExpense = createAsyncThunk(
  "addExpense",
  async (formData) => {
    const res = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed creating expense record");
    return data; 
  }
);

// ===================== FETCH EXPENSES THUNK ===========================
export const getExpenses = createAsyncThunk(
  "getExpenses",
  async ({ page = 1, limit = 5, category = "", sort = "date_desc" } = {}) => {

    const params = new URLSearchParams({
      page,
      limit,
      category,
      sort
    });
    const res = await fetch(
      `${API_URL}/expenses?${params.toString()}`,
      { method: "GET", credentials: "include" }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed fetching expenses record");

    return data;
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    loadingExpenses: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalExpenses: 0,
    limit: 5,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --------------- Delete Expense Thunk reducers -----------------
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp._id !== action.payload.expenseId);
        state.totalExpenses = Math.max(0, state.totalExpenses - 1);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.error.message || "Error deleting expense";
      })

      // --------------- Update Expense Thunk reducers -----------------
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.map(exp => exp._id === action.payload._id ? action.payload : exp);
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.error.message || "Error updating expense";
      })
        // --------------- Add Expense Thunk reducers -----------------
      .addCase(addExpense.pending, (state) => {
        state.loadingExpenses = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loadingExpenses = false;
        if (action.payload?.expense) {
          state.expenses.unshift(action.payload.expense); 
          state.totalExpenses += 1;
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loadingExpenses = false;
        state.error = action.error.message || "Error adding expense to DB";
      })

      // --------------- Fetch Expenses Thunk reducers -----------------
      .addCase(getExpenses.pending, (state) => {
        state.loadingExpenses = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loadingExpenses = false;
        state.expenses = action.payload.expenses;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalExpenses = action.payload.totalExpenses;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loadingExpenses = false;
        state.error = action.error.message || "Error fetching expenses";
      });
  },
});

export default expenseSlice.reducer;
