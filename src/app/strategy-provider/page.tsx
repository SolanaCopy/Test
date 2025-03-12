"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Popover,
  Grid,
  Card,
  CardContent,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { ethers } from "ethers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Replace these variables with your actual contract details
const contractAddress = "0xYOUR_CONTRACT_ADDRESS";
const contractABI = [
  "event Follow(address indexed follower)",
  "event Unfollow(address indexed follower)",
  // Functions to fetch monetization data:
  "function getProfitSharing() view returns (uint256)",
  "function getFees() view returns (uint256)"
];

// Theme definition
const theme = createTheme({
  palette: {
    primary: { main: "#00E0FF" },
    background: { default: "#121212" },
    text: { primary: "#fff" }
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontWeightBold: 700
  }
});

// Navbar button style
const navbarButtonStyle = {
  backgroundColor: "transparent",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(45deg, #00FFC6, #00B8FF)",
    transform: "scale(1.05)"
  }
};

// Smaller card style
const cardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  p: 1,
  m: 1
};

// Notification Popup Component
const NotificationPopup = ({ anchorEl, onClose, notifications }) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#fff",
          p: 2,
          maxWidth: 300
        }
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography variant="body2">You have no new notifications.</Typography>
      ) : (
        <List dense>
          {notifications.map((notif, index) => (
            <ListItem key={index}>
              <ListItemText primary={notif.message} secondary={notif.time} />
            </ListItem>
          ))}
        </List>
      )}
    </Popover>
  );
};

// Hook for handling blockchain events via ethers.js
const useBlockchainListener = () => {
  const [followerCount, setFollowerCount] = useState(100); // starting value; replace if needed
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const handleFollow = (follower) => {
        console.log("New follower:", follower);
        setFollowerCount((prev) => prev + 1);
        setNotifications((prev) => [
          { message: `New follower: ${follower}`, time: new Date().toLocaleTimeString() },
          ...prev
        ]);
      };

      const handleUnfollow = (follower) => {
        console.log("Unfollow:", follower);
        setFollowerCount((prev) => Math.max(prev - 1, 0));
        setNotifications((prev) => [
          { message: `Unfollow: ${follower}`, time: new Date().toLocaleTimeString() },
          ...prev
        ]);
      };

      contract.on("Follow", handleFollow);
      contract.on("Unfollow", handleUnfollow);

      return () => {
        contract.off("Follow", handleFollow);
        contract.off("Unfollow", handleUnfollow);
      };
    } else {
      console.error(
        "Ethereum provider not found. Make sure MetaMask is installed and available."
      );
    }
  }, []);

  return { followerCount, notifications };
};

// Navbar Component with notification badge for followers
const Navbar = ({ notifications }) => {
  const [notifAnchor, setNotifAnchor] = useState(null);

  const navItems = [
    { label: "Homepage", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community Chat", path: "/community-chat" },
    { label: "Strategy Provider", path: "/strategy-provider", special: true }
  ];

  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/trading-logo.png"
            alt="Trading Logo"
            width={40}
            height={40}
            style={{ marginRight: "10px" }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <Button sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}>
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton sx={{ color: "#00FFC6" }} onClick={handleNotifClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}>Login</Button>
        </Box>
        <NotificationPopup anchorEl={notifAnchor} onClose={handleNotifClose} notifications={notifications} />
      </Toolbar>
    </AppBar>
  );
};

// Helper function to shorten a wallet address
const truncateWallet = (wallet) =>
  wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";

// StrategyProvider Component: displays wallet address, statistics, followers and a "Start trading" button
const StrategyProvider = () => {
  const router = useRouter();
  const { followerCount, notifications } = useBlockchainListener();

  // Dummy data for wallet and statistics
  const walletAddress = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12";
  const stats = {
    totalTrades: 125,
    profit: "$5,678",
    successRate: "78%",
    portfolioValue: "$12,345",
    chartData: {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      datasets: [
        {
          label: "Profit (USD)",
          data: [500, 750, 300, 900, 1200],
          borderColor: "#00FFC6",
          backgroundColor: "rgba(0, 255, 198, 0.3)",
          tension: 0.4
        }
      ]
    }
  };

  // State for monetization data
  const [profitSharing, setProfitSharing] = useState("0");
  const [fees, setFees] = useState("0");

  useEffect(() => {
    async function fetchMonetization() {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);
          const profit = await contract.getProfitSharing();
          const feeValue = await contract.getFees();
          setProfitSharing(ethers.formatEther(profit));
          setFees(ethers.formatEther(feeValue));
        } catch (err) {
          console.error("Failed to fetch monetization data", err);
        }
      }
    }
    fetchMonetization();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Navbar with notifications */}
      <Navbar notifications={notifications} />
      {/* Content of the Strategy Provider page */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
          Strategy Provider
        </Typography>
        {/* Prominent "Start trading" button */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #00FFC6, #00B8FF)",
              fontWeight: "bold",
              px: 4,
              py: 1,
              "&:hover": { background: "linear-gradient(45deg, #00B8FF, #00FFC6)" }
            }}
            onClick={() => router.push("/traderdashboard")}
          >
            Start trading
          </Button>
        </Box>
        {/* Wallet address and followers */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#ccc" }}>
            Wallet Address:
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, color: "#00FFC6", fontWeight: "bold" }}>
            {truncateWallet(walletAddress)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "#fff" }}>
            Followers: {followerCount}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Total Trades</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stats.totalTrades}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Total Profit</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stats.profit}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Success Rate</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stats.successRate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Portfolio Value</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stats.portfolioValue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Monetization overview: Profit Sharing and Fees */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Profit Sharing</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  ${profitSharing}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">Fees</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  ${fees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 4, borderColor: "#00FFC6" }} />
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
              Weekly Profit
            </Typography>
            <Box
              sx={{
                p: 2,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px"
              }}
            >
              <Line data={stats.chartData} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default StrategyProvider;
