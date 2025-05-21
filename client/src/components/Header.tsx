import { useAppDispatch } from "../hooks/hooks";
import { logout } from "../features/auth/auth.slice";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

interface HeaderProps {
  user: {
    name: string;
    role: string;
  };
}

const Header = ({ user }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Welcome, {
              (() => {
                const userItem = localStorage.getItem("user");
                if (!userItem) return "";
                try {
                  const userObj = typeof userItem === "string" ? JSON.parse(userItem) : userItem;
                  return userObj?.firstname || "";
                } catch {
                  return "";
                }
              })()
            }
          </Typography>
        </Box>
        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
