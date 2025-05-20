import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import axiosInstance from '../../services/axios';
import { toast } from 'react-toastify';

interface Bill {
  id: string;
  plateNumber: string;
  entryDateTime: string;
  exitDateTime: string;
  chargedAmount: number;
  parking: {
    id: string;
    name: string;
  };
}

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      const response = await axiosInstance.get('/parking-entry/bills');
      setBills(response.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDownloadBill = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/parking-entry/bill/${id}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading bill:', error);
      toast.error('Failed to download bill');
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
      field: 'exitDateTime', 
      headerName: 'Exit Time', 
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
      valueGetter: (params: GridRenderCellParams) => params.row.parking?.name || 'N/A',
    },
    {
      field: 'chargedAmount',
      headerName: 'Amount',
      width: 130,
      valueFormatter: (params: { value: number }) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleDownloadBill(params.row.id)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bills
      </Typography>

      <Card>
        <CardContent>
          <DataGrid
            rows={bills}
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
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Bills; 