import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../hooks/hooks";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../../services/axios";

interface Parking {
  id: string;
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  chargePerHour: number;
}

interface ParkingEntry {
  id: string;
  plateNumber: string;
  entryDateTime: string;
  parking: {
    id: string;
    name: string;
    code: string;
  };
  isActive: boolean;
}

const ParkingOperations = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [activeEntries, setActiveEntries] = useState<ParkingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ParkingEntry | null>(null);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [entryForm, setEntryForm] = useState({
    plateNumber: "",
  });

  const { user } = useAppSelector((state) => state.auth);

  const fetchParkings = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/parking", {
        headers: {Authorization:`Bearer ${token}`}
      });
      console.log(response.data);
      setParkings(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch parkings");
    }
  }, []);

  const fetchActiveEntries = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/parking-entry/active", {
        headers: {Authorization:`Bearer ${token}`}
      });
      setActiveEntries(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch active entries");
    } finally {
      setLoading(false);
    }
  }, []);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchParkings(), fetchActiveEntries()]);
    };
    loadData();

    // Set up polling for active entries
    const pollInterval = setInterval(fetchActiveEntries, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchParkings, fetchActiveEntries]);

  const handleEntrySubmit = async () => {
    if (!entryForm.plateNumber || !selectedParking?.id) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosInstance.post("/parking-entry/entry", {
        plateNumber: entryForm.plateNumber,
        parkingId: selectedParking.id,
      }, {
        headers: {Authorization:`Bearer ${token}`}
      });

      // Generate and print ticket
      const ticket = await axiosInstance.post("/parking-entry/ticket", {
        entryId: response.data.data.id,
      }, {
        headers: {Authorization:`Bearer ${token}`}
      });

      // Open ticket in new window for printing
      const ticketWindow = window.open("", "_blank");
      if (ticketWindow) {
        ticketWindow.document.write(ticket.data.data);
        ticketWindow.document.close();
        ticketWindow.print();
      }

      toast.success("Vehicle entry recorded successfully");
      setEntryDialogOpen(false);
      setEntryForm({ plateNumber: "" });
      setSelectedParking(null);
      await Promise.all([fetchParkings(), fetchActiveEntries()]);
    } catch (error) {
      toast.error("Failed to record vehicle entry");
    }
  };

  const handleExitRequest = async (id: string) => {
    try {
      const response = await axiosInstance.post(`/parking-entry/exit`, {entryId: id}, {headers:{Authorization: `Bearer ${token}`}});
      if (response.data.success) {
        toast.success('Exit processed successfully');
        // Download the bill
        const billResponse = await axiosInstance.get(`/parking-entry/bill/${id}`, {
          responseType: 'blob',
          headers:{Authorization: `Bearer ${token}`}
        });
        
        const url = window.URL.createObjectURL(new Blob([billResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bill-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Refresh the active entries list
        fetchActiveEntries();
      }
    } catch (error) {
      console.error('Error processing exit:', error);
      toast.error('Failed to process exit');
    }
  };

  const handleDownloadTicket = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/parking-entry/ticket/${id}`, {
        responseType: 'blob',
         headers:{Authorization: `Bearer ${token}`}
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error('Failed to download ticket');
    }
  };

  const columns: GridColDef[] = [
    { field: 'plateNumber', headerName: 'Plate Number', width: 130 },
    { 
      field: 'entryDateTime', 
      headerName: 'Entry Time', 
      width: 180,
      valueFormatter: (params: { value: string }) => {
        try {
          return format(new Date(params.value), 'PPpp');
        } catch (error) {
          return 'Invalid date';
        }
      }
    },
    {
      field: 'parking',
      headerName: 'Parking',
      width: 200,
      valueGetter: (params: GridRenderCellParams) => params.row?.parking?.name || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleExitRequest(params.row.id)}
            sx={{ mr: 1 }}
          >
            Request Exit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDownloadTicket(params.row.id)}
          >
            Download Ticket
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid display={"flex"} flexDirection={"column"} container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Parking Operations
          </Typography>
        </Grid>

        {/* Available Parkings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Available Parkings
          </Typography>
          <Grid container spacing={2}>
            {parkings?.map((parking) => (
              <Grid item xs={12} sm={6} md={4} key={parking.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{parking.name}</Typography>
                    <Typography color="textSecondary">
                      Code: {parking.code}
                    </Typography>
                    <Typography>Location: {parking.location}</Typography>
                    <Typography>
                      Available Spaces: {parking.availableSpaces} /{" "}
                      {parking.totalSpaces}
                    </Typography>
                    <Typography>
                      Charge: ${parking.chargePerHour}/hour
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setSelectedParking(parking);
                        setEntryDialogOpen(true);
                      }}
                      disabled={parking.availableSpaces === 0}
                    >
                      Record Entry
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Active Entries */}
        {/* Active Entries */}
<Grid item xs={12} component="div">
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Active Entries
      </Typography>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={activeEntries}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10]}
          autoHeight
          disableRowSelectionOnClick
          loading={loading}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid rgba(224, 224, 224, 0.5)',
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid rgba(255, 255, 255, 0.5)',
            },
            '& .MuiDataGrid-cell:last-child': {
              borderRight: 'none',
            },
            '& .MuiDataGrid-columnHeader:last-child': {
              borderRight: 'none',
            },
          }}
        />
      </Box>
    </CardContent>
  </Card>
</Grid>
      </Grid>

      {/* Entry Dialog */}
      <Dialog open={entryDialogOpen} onClose={() => setEntryDialogOpen(false)}>
        <DialogTitle>Record Vehicle Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Plate Number"
            fullWidth
            value={entryForm.plateNumber}
            onChange={(e) =>
              setEntryForm({ ...entryForm, plateNumber: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Parking"
            fullWidth
            value={selectedParking?.id || ""}
            onChange={(e) => {
              const parking = parkings.find(p => p.id === e.target.value);
              setSelectedParking(parking || null);
            }}
          >
            {parkings.map((parking) => (
              <MenuItem key={parking.id} value={parking.id}>
                {parking.name} ({parking.code})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEntryDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEntrySubmit}
            variant="contained"
            color="primary"
          >
            Record Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Dialog */}
      <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
        <DialogTitle>Record Vehicle Exit</DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box>
              <Typography>
                Plate Number: {selectedEntry.plateNumber}
              </Typography>
              <Typography>
                Entry Time:{" "}
                {format(new Date(selectedEntry.entryDateTime), "PPpp")}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                This will generate a bill and update the parking space
                availability.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExitRequest} variant="contained" color="primary">
            Record Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParkingOperations; 