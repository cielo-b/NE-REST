import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axios";
import type { RootState } from "../../app/store";

interface Parking {
  id: string;
  name: string;
  location: string;
  code: string;
  numberOfAvailableSpaces: number;
  pricePerHour: number;
}

interface ParkingSpot {
  id: string;
  number: string;
  status: "available" | "occupied" | "maintenance";
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  ownerId: string;
}

interface Booking {
  id: string;
  parkingId: string;
  spotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface ParkingRequest {
  id: string;
  parkingId: string;
  vehicleId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ExitRequest {
  id: string;
  parkingId: string;
  vehicleId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Receipt {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  status: "paid" | "pending";
}

interface AdminState {
  parkings: Parking[];
  vehicles: Vehicle[];
  bookings: Booking[];
  parkingRequests: ParkingRequest[];
  exitRequests: ExitRequest[];
  receipts: Receipt[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  parkings: [],
  vehicles: [],
  bookings: [],
  parkingRequests: [],
  exitRequests: [],
  receipts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchParkings = createAsyncThunk(
  "admin/fetchParkings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/parking");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch parkings");
    }
  }
);

export const createParking = createAsyncThunk(
  "admin/createParking",
  async (data: Omit<Parking, "id" | "code">, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/parking", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create parking");
    }
  }
);

export const updateParking = createAsyncThunk(
  "admin/updateParking",
  async ({ id, data }: { id: string; data: Partial<Parking> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/parking/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update parking");
    }
  }
);

export const deleteParking = createAsyncThunk(
  "admin/deleteParking",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/parking/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete parking");
    }
  }
);

export const createParkingSpot = createAsyncThunk(
  "admin/createParkingSpot",
  async (
    data: { parkingId: string; data: { number: string; status: string } },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/parking/${data.parkingId}/spots/create`,
        data.data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create parking spot"
      );
    }
  }
);

export const fetchVehicles = createAsyncThunk(
  "admin/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/vehicle", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicles"
      );
    }
  }
);

export const fetchBookings = createAsyncThunk(
  "admin/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "admin/updateBookingStatus",
  async (
    data: { id: string; status: "confirmed" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/bookings/${data.id}/status`, {
        status: data.status,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

export const fetchParkingRequests = createAsyncThunk(
  "admin/fetchParkingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/parking-requests");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch parking requests"
      );
    }
  }
);

export const updateParkingRequest = createAsyncThunk(
  "admin/updateParkingRequest",
  async (
    data: { id: string; status: "approved" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/parking-requests/${data.id}`, {
        status: data.status,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update parking request"
      );
    }
  }
);

export const fetchExitRequests = createAsyncThunk(
  "admin/fetchExitRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/exit-requests");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch exit requests"
      );
    }
  }
);

export const updateExitRequest = createAsyncThunk(
  "admin/updateExitRequest",
  async (
    data: { id: string; status: "approved" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/exit-requests/${data.id}`, {
        status: data.status,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update exit request"
      );
    }
  }
);

export const fetchReceipts = createAsyncThunk(
  "admin/fetchReceipts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/receipt", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch receipts"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Parkings
    builder
      .addCase(fetchParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.parkings = action.payload;
      })
      .addCase(fetchParkings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });

    // Create Parking
    builder
      .addCase(createParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParking.fulfilled, (state, action) => {
        state.loading = false;
        state.parkings.push(action.payload);
        toast.success("Parking created successfully");
      })
      .addCase(createParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });

    // Update Parking
    builder
      .addCase(updateParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.parkings.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.parkings[index] = action.payload;
        }
        toast.success("Parking updated successfully");
      })
      .addCase(updateParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });

    // Delete Parking
    builder
      .addCase(deleteParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParking.fulfilled, (state, action) => {
        state.loading = false;
        state.parkings = state.parkings.filter((p) => p.id !== action.payload);
        toast.success("Parking deleted successfully");
      })
      .addCase(deleteParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error);
      });

    // Vehicles
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });

    // Parking Requests
    builder
      .addCase(fetchParkingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingRequests = action.payload;
      })
      .addCase(fetchParkingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateParkingRequest.fulfilled, (state, action) => {
        const index = state.parkingRequests.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.parkingRequests[index] = action.payload;
        }
      });

    // Exit Requests
    builder
      .addCase(fetchExitRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExitRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.exitRequests = action.payload;
      })
      .addCase(fetchExitRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExitRequest.fulfilled, (state, action) => {
        const index = state.exitRequests.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.exitRequests[index] = action.payload;
        }
      });

    // Receipts
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export const selectAdmin = (state: RootState) => state.admin;
export default adminSlice.reducer;
