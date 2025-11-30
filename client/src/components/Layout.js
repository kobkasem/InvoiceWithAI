import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  List as ListIcon,
  Edit as EditIcon,
  RateReview as ReviewIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isSupervisor } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMainMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMainMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMainMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      show: true,
    },
    {
      text: "Upload Invoice",
      icon: <UploadIcon />,
      path: "/upload",
      show: true,
    },
    { text: "Invoice List", icon: <ListIcon />, path: "/invoices", show: true },
    {
      text: "Manual Entry",
      icon: <EditIcon />,
      path: "/manual-entry",
      show: true,
    },
    {
      text: "Review",
      icon: <ReviewIcon />,
      path: "/review",
      show: isSupervisor,
    },
    {
      text: "User Management",
      icon: <PeopleIcon />,
      path: "/users",
      show: isAdmin,
    },
    {
      text: "Prompt Management",
      icon: <SettingsIcon />,
      path: "/prompts",
      show: isSupervisor,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 4 }}>
            Synnex Invoice
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMainMenuOpen}
              sx={{
                mr: 2,
                backgroundColor: Boolean(menuAnchorEl)
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMainMenuClose}
            >
              {menuItems
                .filter((item) => item.show)
                .map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.icon}
                      {item.text}
                    </Box>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user?.email}
            </Typography>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user?.full_name || user?.email}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption">Role: {user?.role}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;





