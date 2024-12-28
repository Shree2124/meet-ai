import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../store"; // Import AppThunk type
import axiosInstance from "../../utils/axios";
import { useRouter } from "next/navigation";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  guest: any;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  guest: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    setGuest: (state, action) =>{
      state.guest = action.payload
      state.loading = false;
    }
  },
});

export const {
  setUser,
  setError,
  setLoading,
  clearUser,
  setGuest
} = authSlice.actions;

export const loginUser = (credentials: {
  userName: string;
  password: string;
}): AppThunk => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/user/login", credentials);
    return response;
  } catch (error:any) {
    dispatch(setError(error.response?.data?.message || "Login failed"));
    return error
  }
};

export const fetchUser = (): AppThunk => async (
  dispatch: (arg0: {
    payload: any;
    type: "auth/setUser" | "auth/setError" | "auth/setLoading";
  }) => void
) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.get("/user/get-user");
    dispatch(setUser(response.data.data.FetchedUser));
  } catch (error) {
    dispatch(setError("Unauthorized"));
  }
};

export default authSlice.reducer;
