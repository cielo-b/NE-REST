import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [error, setError] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { 
      field: 'plateNumber', 
      headerName: 'Plate Number', 
      width: 150,
      headerClassName: 'header-style',
    },
    { 
      field: 'entryDateTime', 
      headerName: 'Entry Time', 
      width: 200,
      valueFormatter: (params) => format(new Date(params.value), 'PPpp'),
      headerClassName: 'header-style',
    },
    { 
      field: 'exitDateTime', 
      headerName: 'Exit Time', 
      width: 200,
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'PPpp') : 'Active',
      headerClassName: 'header-style',
    },
    {
      field: 'parking',
      headerName: 'Parking',
      width: 200,
      valueGetter: (params) => `${params.row.parking.name} (${params.row.parking.code})`,
      headerClassName: 'header-style',
    },
    {
      field: 'chargedAmount',
      headerName: 'Charged Amount',
      width: 150,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      headerClassName: 'header-style',
      cellClassName: (params) => 
        params.value > 0 ? 'positive-amount' : 'zero-amount',
    },
  ];

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3000/parking-entry/report', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setEntries(response.data.data);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalEntries = entries.length;
    const totalRevenue = entries.reduce((sum, entry) => sum + entry.chargedAmount, 0);
    const activeEntries = entries.filter((entry) => !entry.exitDateTime).length;
    const completedEntries = totalEntries - activeEntries;

    return {
      totalEntries,
      totalRevenue,
      activeEntries,
      completedEntries,
    };
  };

  const totals = calculateTotals();

  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = ['Plate Number', 'Entry Time', 'Exit Time', 'Parking', 'Charged Amount'];
    const csvRows = [
      headers.join(','),
      ...entries.map(entry => 
        [
          entry.plateNumber,
          format(new Date(entry.entryDateTime), 'PPpp'),
          entry.exitDateTime ? format(new Date(entry.exitDateTime), 'PPpp') : 'Active',
          `${entry.parking.name} (${entry.parking.code})`,
          `$${entry.chargedAmount.toFixed(2)}`
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `parking_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Parking Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Report Parameters
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                  maxDate={endDate || new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                  minDate={startDate}
                  maxDate={new Date()}
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
                size="large"
                sx={{ height: '56px' }}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {entries.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: 'primary.light' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Entries
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totals.totalEntries}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: 'success.light' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Entries
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totals.completedEntries}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: 'warning.light' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Entries
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totals.activeEntries}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', bgcolor: 'info.light' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${totals.totalRevenue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Entry History
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleExportCSV}
                  disabled={entries.length === 0}
                >
                  Export to CSV
                </Button>
              </Box>
              <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                  rows={entries}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  autoHeight
                  disableSelectionOnClick
                  loading={loading}
                  sx={{
                    '& .header-style': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                    '& .positive-amount': {
                      color: 'success.main',
                      fontWeight: 'bold',
                    },
                    '& .zero-amount': {
                      color: 'text.secondary',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default ParkingReports;