import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { ERole } from "../enums/ERole";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box, CircularProgress } from "@mui/material";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const path = location.pathname;
      if (path === "/dashboard") {
        if (user.role === ERole.ADMIN) {
          navigate("/dashboard/admin/parking", { replace: true });
        } else if (user.role === ERole.ATTENDANT) {
          navigate("/dashboard/attendant/parking", { replace: true });
        }
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname, user]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role={user.role} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: "240px" },
        }}
      >
        <Header user={user} />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
