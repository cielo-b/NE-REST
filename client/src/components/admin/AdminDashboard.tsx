import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import ParkingReports from './ParkingReports';
import ActiveEntries from './ActiveEntries';
import Bills from './Bills';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin dashboard tabs">
          <Tab label="Reports" />
          <Tab label="Active Entries" />
          <Tab label="Bills" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ParkingReports />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActiveEntries />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Bills />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard; 