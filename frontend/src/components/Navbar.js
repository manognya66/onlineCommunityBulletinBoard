import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import CustomModal from "./CustomModal";
import { useAuth } from "./AuthContext";

function MenuAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check localStorage for login state on component mount
    const loggedInState = localStorage.getItem("isLoggedIn");
    if (!loggedInState) {
      logout(); // Logout if no login state is found
      navigate("/login");
    }
  }, [logout, navigate]);

  useEffect(() => {
    const titles = {
      "/": "Cloud Flow",
      "/post-event": "Post Event",
      "/my-posts": "My Posts",
      "/profile": "My Profile",
    };
    document.title = titles[location.pathname] || "Cloud Flow Online Community";
  }, [location.pathname]);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const navigateToPage = (path) => {
    if (!isLoggedIn && (path === "/post-event" || path === "/my-posts")) {
      setShowModal(true);
      handleMenuClose();
    } else {
      navigate(path);
      handleMenuClose();
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("isLoggedIn"); // Clear the login state
    navigate("/");
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Cloud Flow";
      case "/post-event":
        return "Post Event";
      case "/my-posts":
        return "My Posts";
      case "/profile":
        return "My Profile";
      default:
        return "Cloud Flow Online Community";
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Helmet>
        <title>{getTitle()}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <AppBar position="static" sx={{ backgroundColor: "#c6ac8f" }}>
        <Toolbar
          sx={{
            fontFamily: "Open Sans, sans-serif",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ ml: 5, padding: 1, color: "white" }}
          >
            <MenuIcon sx={{ fontSize: 40, color: "white" }} />
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: "Open Sans, sans-serif",
                color: "white",
                fontSize: "1.7rem",
                textAlign: "center",
                width: "100%",
                ml: 20,
              }}
            >
              {getTitle()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {!isLoggedIn ? (
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mr: 5 }}>
                <MenuItem
                  onClick={() => {
                    navigate("/login");
                  }}
                  sx={{ fontSize: "1.2em", color: "white", fontFamily: "Open Sans, sans-serif" }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/signup");
                  }}
                  sx={{ fontSize: "1.2em", color: "white", fontFamily: "Open Sans, sans-serif" }}
                >
                  Sign Up
                </MenuItem>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mr: 5 }}>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                  }}
                  sx={{ fontSize: "1.2em", color: "white", fontFamily: "Open Sans, sans-serif" }}
                >
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ fontSize: "1.2em", color: "white", fontFamily: "Open Sans, sans-serif" }}>
                  Logout
                </MenuItem>
              </Box>
            )}
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            disableScrollLock={true}
          >
            <MenuItem
              onClick={() => navigateToPage("/")}
              sx={{ fontFamily: "Open Sans, sans-serif", fontSize: "1.2em" }}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={() => navigateToPage("/post-event")}
              sx={{ fontFamily: "Open Sans, sans-serif", fontSize: "1.2em" }}
            >
              Post Event
            </MenuItem>
            <MenuItem
              onClick={() => navigateToPage("/my-posts")}
              sx={{ fontFamily: "Open Sans, sans-serif", fontSize: "1.2em" }}
            >
              My Posts
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <CustomModal
        showModal={showModal}
        onClose={handleModalClose}
        message="Login or Signin to access this Page."
      />
    </Box>
  );
}

export default MenuAppBar;
