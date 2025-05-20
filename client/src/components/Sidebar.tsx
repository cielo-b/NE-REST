import { NavLink } from "react-router-dom";
import { ERole } from "../enums/ERole";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Assessment as ReportIcon,
  Receipt as ReceiptIcon,
  LocalParking as ParkingIcon,
} from "@mui/icons-material";

interface SidebarProps {
  role: ERole;
}

const Sidebar = ({ role }: SidebarProps) => {
  const attendantLinks = [
    { text: "Operations", icon: <CarIcon />, path: "/dashboard/attendant/operations" },
    { text: "Bills", icon: <ReceiptIcon />, path: "/dashboard/attendant/bills" },
  ];

  const adminLinks = [
    { text: "Parkings", icon: <ParkingIcon />, path: "/dashboard/admin/parking" },
    { text: "Reports", icon: <ReportIcon />, path: "/dashboard/admin/reports" },
    { text: "Bills", icon: <ReceiptIcon />, path: "/dashboard/admin/bills" },
  ];

  const links = role === ERole.ADMIN ? adminLinks : attendantLinks;

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        position: "fixed",
        height: "100vh",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {role === ERole.ADMIN ? "Admin Dashboard" : "Attendant Dashboard"}
        </Typography>
      </Box>
      <List>
        {links.map((link) => (
          <ListItem
            key={link.text}
            component={NavLink}
            to={link.path}
            sx={{
              color: "text.primary",
              "&.active": {
                bgcolor: "action.selected",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
                "& .MuiListItemText-primary": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;