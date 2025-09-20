const API_URL = import.meta.env.VITE_SERVER_URI;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===================== SIGNUP THUNK ===========================
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formData) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data;
  }
);

// ===================== LOGIN THUNK ===========================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    
    return data;
  }
);

// ==================== VERIFY-AUTH THUNK ======================
export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async () => {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      credentials: "include",
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Not authenticated");
    return data;
  }
);

// ==================== LOGOUT THUNK ======================
export const logoutUser = createAsyncThunk(
"auth/logout",
async()=>{
  const res = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed logout");
    return data;
}
)

// ==================== CHANGE PASSWORD THUNK ======================
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }) => {
    const res = await fetch(`${API_URL}/user/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to change password");
    return data;
  }
);

// ==================== DELETE ACCOUNT THUNK ======================
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async () => {
    const res = await fetch(`${API_URL}/user/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete account");
    return data;
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
    // --------------- Signup Thunk reducers -----------------
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      })


      // --------------- Login Thunk reducers -----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      
      // --------------- Verify Thunk Reducers -----------------
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message || "Auth verification failed";
      })
 
 
      // --------------- Logout Thunk Reducers -----------------
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      // --------------- Change Password Thunk Reducers -----------------
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Change password failed";
      })

      // --------------- Delete Account Thunk Reducers -----------------
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Delete account failed";
      })
    },
});


export default authSlice.reducer;
