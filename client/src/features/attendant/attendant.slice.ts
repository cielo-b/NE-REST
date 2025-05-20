import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface VehicleEntry {
  id: string;
  vehicleNumber: string;
  entryTime: string;
  exitTime?: string;
  parkingId: string;
  parkingName: string;
  status: "ACTIVE" | "COMPLETED";
  amount?: number;
}

interface AttendantState {
  activeEntries: VehicleEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendantState = {
  activeEntries: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchActiveEntries = createAsyncThunk(
  "attendant/fetchActiveEntries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/vehicle-entries/active");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch active entries");
    }
  }
);

export const createVehicleEntry = createAsyncThunk(
  "attendant/createVehicleEntry",
  async (data: { vehicleNumber: string; parkingId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/vehicle-entries", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create vehicle entry");
    }
  }
);

export const completeVehicleEntry = createAsyncThunk(
  "attendant/completeVehicleEntry",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/vehicle-entries/${id}/complete`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to complete vehicle entry");
    }
  }
);

const attendantSlice = createSlice({
  name: "attendant",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active Entries
      .addCase(fetchActiveEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.activeEntries = action.payload;
      })
      .addCase(fetchActiveEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      // Create Vehicle Entry
      .addCase(createVehicleEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicleEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.activeEntries.push(action.payload);
        toast.success("Vehicle entry created successfully");
      })
      .addCase(createVehicleEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      })
      // Complete Vehicle Entry
      .addCase(completeVehicleEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeVehicleEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.activeEntries = state.activeEntries.filter(
          (entry) => entry.id !== action.payload.id
        );
        toast.success("Vehicle entry completed successfully");
      })
      .addCase(completeVehicleEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });
  },
});

export const { clearError } = attendantSlice.actions;
export default attendantSlice.reducer; 