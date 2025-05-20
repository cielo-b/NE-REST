import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import ParkingOperations from './ParkingOperations';
import Bills from '../shared/Bills';

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

const AttendantDashboard: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="attendant dashboard tabs">
          <Tab label="Operations" />
          <Tab label="Bills" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ParkingOperations />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Bills />
      </TabPanel>
    </Box>
  );
};

export default AttendantDashboard; 