import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface ParkingEntry {
  id: string;
  plateNumber: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  parking: {
    name: string;
    code: string;
  };
}

const ParkingReports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: GridColDef[] = [
    { field: 'plateNumber', headerName: 'Plate Number', width: 150 },
    { field: 'entryDateTime', headerName: 'Entry Time', width: 200 },
    { field: 'exitDateTime', headerName: 'Exit Time', width: 200 },
    {
      field: 'parking',
      headerName: 'Parking',
      width: 200,
      valueGetter: (params) => params.row.parking.name,
    },
    {
      field: 'chargedAmount',
      headerName: 'Charged Amount',
      width: 150,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
  ];

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/parking-entry/report', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setEntries(response.data.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalEntries = entries.length;
    const totalRevenue = entries.reduce((sum, entry) => sum + entry.chargedAmount, 0);
    const activeEntries = entries.filter((entry) => !entry.exitDateTime).length;

    return {
      totalEntries,
      totalRevenue,
      activeEntries,
    };
  };

  const totals = calculateTotals();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Parking Reports
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateReport}
                disabled={loading}
                fullWidth
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Entries
              </Typography>
              <Typography variant="h4">{totals.totalEntries}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">${totals.totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Entries
              </Typography>
              <Typography variant="h4">{totals.activeEntries}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Entry History
          </Typography>
          <DataGrid
            rows={entries}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            autoHeight
            disableSelectionOnClick
            loading={loading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParkingReports; 