import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import axiosInstance from '../../services/axios';

interface Parking {
  id: string;
  name: string;
  code: string;
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
}

const ActiveEntries: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [activeEntries, setActiveEntries] = useState<ParkingEntry[]>([]);
  const [selectedParking, setSelectedParking] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchParkings = async () => {
    try {
      const response = await axiosInstance.get('/parking');
      setParkings(response.data.data);
    } catch (error) {
      console.error('Error fetching parkings:', error);
    }
  };

  const fetchActiveEntries = async () => {
    try {
      const response = await axiosInstance.get('/parking-entry/active');
      setActiveEntries(response.data.data);
    } catch (error) {
      console.error('Error fetching active entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
    fetchActiveEntries();
  }, []);

  const columns: GridColDef[] = [
    { field: 'plateNumber', headerName: 'Plate Number', width: 130 },
    { field: 'entryDateTime', headerName: 'Entry Time', width: 180,
      valueFormatter: (params) => {
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
      valueGetter: (params) => params.row.parking.name,
    },
  ];

  const filteredEntries = selectedParking === 'all'
    ? activeEntries
    : activeEntries.filter(entry => entry.parking.id === selectedParking);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Active Entries
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={selectedParking}
            onChange={(_, newValue) => setSelectedParking(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Parkings" value="all" />
            {parkings.map((parking) => (
              <Tab
                key={parking.id}
                label={parking.name}
                value={parking.id}
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DataGrid
            rows={filteredEntries}
            columns={columns}
            getRowId={(row) => row.id}
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

export default ActiveEntries; 