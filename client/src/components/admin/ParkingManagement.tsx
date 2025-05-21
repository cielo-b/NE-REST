import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Parking {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  numberOfAvailableSpaces: number;
  code: string;
}

const ParkingManagement: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    price: '',
    numberOfSpaces: '',
  });

  // const token: string = JSON.parse(localStorage.getItem("token") || "");
  const token = localStorage.getItem("token") || "";

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'pricePerHour', headerName: 'Price/Hour', width: 120 },
    { field: 'numberOfAvailableSpaces', headerName: 'Available Spaces', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/parking', {
        headers: {Authorization: `Bearer ${token}`}
      });
      setParkings(response.data.data);
    } catch (error) {
      console.error('Error fetching parkings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/parking/create', {
        name: formData.name,
        address: formData.address,
        price: Number(formData.price),
        numberOfSpaces: Number(formData.numberOfSpaces),
      }, {
        headers: {Authorization: `Bearer ${token}`}
      });
      setOpen(false);
      fetchParkings();
      resetForm();
    } catch (error) {
      console.error('Error creating parking:', error);
    }
  };

  const handleEdit = (parking: Parking) => {
    setFormData({
      name: parking.name,
      address: parking.location,
      price: parking.pricePerHour.toString(),
      numberOfSpaces: parking.numberOfAvailableSpaces.toString(),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this parking?')) {
      try {
        await axios.delete(`http://localhost:3000/parking/${id}`, {
          headers: {Authorization: `Bearer ${token}`}
        });
        fetchParkings();
      } catch (error) {
        console.error('Error deleting parking:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      price: '',
      numberOfSpaces: '',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Parking Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add New Parking
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={parkings}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            autoHeight
            disableSelectionOnClick
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {formData.name ? 'Edit Parking' : 'Add New Parking'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price per Hour"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of Spaces"
                  type="number"
                  value={formData.numberOfSpaces}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfSpaces: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {formData.name ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ParkingManagement; 