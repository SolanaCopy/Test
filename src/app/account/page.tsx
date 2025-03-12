"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ethers } from "ethers";
import {
  Container,
  Box,
  Card,
  Typography,
  Button,
  TextField,
  CssBaseline,
  AppBar,
  Toolbar,
  LinearProgress,
  Snackbar,
  Alert,
  IconButton,
  Drawer
} from "@mui/material";
import Image from "next/image";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Chart.js imports
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Aangepast thema met achtergrondkleur "#121212"
const theme = createTheme({
  palette: {
    primary: { main: "#00E0FF" },
    secondary: { main: "#00FFC6" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" }
  }
});

// Glas-effect style voor andere componenten
const glassEffect = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
};

// Navbar glas-effect
const navbarGlassEffect = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
};

// Aangepaste button-styling (dezelfde gradient als in "Create Smart Wallet")
const buttonStyle = {
  background: "linear-gradient(45deg, #00FFC6, #00B8FF)",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  boxShadow: "0px 4px 15px rgba(0,224,255,0.5)",
  transition: "all 0.3s ease-in-out",
  padding: "6px 12px",
  borderRadius: "8px",
  "&:hover": {
    background: "linear-gradient(45deg, #00B8FF, #00FFC6)",
    transform: "scale(1.05)"
  }
};

// Basis styling voor navbar knoppen
const navbarButtonStyle = {
  backgroundColor: "transparent",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "#00E0FF",
    color: "#fff",
    transform: "scale(1.05)"
  }
};

// Navbar component zonder extra glow op de actieve knop
const Navbar = ({ onNotifOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { label: "Homepage", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community Chat", path: "/community-chat" }
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        ...navbarGlassEffect,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/trading-logo.png"
            alt="Trading Logo"
            width={40}
            height={40}
            style={{ marginRight: "10px" }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton onClick={onNotifOpen} sx={{ ...navbarButtonStyle }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#00FFC6"
              viewBox="0 0 24 24"
            >
              <path d="M12 22c1.1046 0 2-.8954 2-2h-4c0 1.1046.8954 2 2 2zm6.364-6c.31-.31.636-1.055.636-2v-5c0-3.07-1.64-5.64-4.5-6.32v-.68c0-.8284-.6716-1.5-1.5-1.5s-1.5.6716-1.5 1.5v.68c-2.86.68-4.5 3.25-4.5 6.32v5c0 .945.326.69.636 2h12.728z" />
            </svg>
          </IconButton>
          <Button onClick={() => router.push("/account")} sx={navbarButtonStyle}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Notificatie-pop-up content
const NotificationContent = () => {
  return (
    <Box sx={{ p: 2, color: "#fff" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Notifications
      </Typography>
      <Typography variant="body2" sx={{ color: "#ccc" }}>
        No new notifications.
      </Typography>
    </Box>
  );
};

// Progress bar component met label
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", width: "100%", mt: 1 }}>
      <LinearProgress
        variant="determinate"
        {...props}
        sx={{
          height: 15,
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            background: "linear-gradient(90deg, #76FF03, #64DD17)"
          }
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#fff", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const [account, setAccount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [dailyProfit, setDailyProfit] = useState(120);
  const [weeklyProfit, setWeeklyProfit] = useState(840);
  const [monthlyProfit, setMonthlyProfit] = useState(3600);
  // Deze waarden worden via het smart contract opgehaald (hier gesimuleerd)
  const [userBalance, setUserBalance] = useState("0");
  const [withdrawnBalance, setWithdrawnBalance] = useState("0");
  const [claimableProfit, setClaimableProfit] = useState("0");
  const [dailyProfitHistory, setDailyProfitHistory] = useState([]);
  const referralLink = "https://securetradingvault.com/ref?user=12345";

  // Snackbar state voor wallet-notificaties
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  // Nieuwe state voor de notificatie Drawer
  const [notifOpen, setNotifOpen] = useState(false);
  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);

  const router = useRouter();
  const pathname = usePathname();

  // Gesimuleerde data voor daily profit history
  const simulatedDailyProfitHistory = [
    5, 7, 6, 8, 7, 7, 8, 6, 7, 7, -8, -8, 7, 8, 6, 7, 7, 8, 7, 6, 7, 7, 7, 8, 6, 7, 7, 8, 7, 6
  ];

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) {
      getUserBalance();
      getWithdrawnBalance();
      getClaimableProfit();
      setDailyProfitHistory(simulatedDailyProfitHistory);
    }
  }, [account]);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setNotificationMessage("Error connecting wallet.");
        setNotificationSeverity("error");
        setNotificationOpen(true);
      }
    } else {
      setNotificationMessage("Metamask is not installed!");
      setNotificationSeverity("error");
      setNotificationOpen(true);
    }
  }

  async function getUserBalance() {
    if (window.ethereum && account) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = "0xYourContractAddress"; // vervang door jouw contractadres
        const abi = ["function getUserBalance(address user) view returns (uint256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getUserBalance(account);
        setUserBalance(ethers.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
  }

  async function getWithdrawnBalance() {
    if (window.ethereum && account) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = "0xYourContractAddress";
        const abi = ["function getWithdrawnBalance(address user) view returns (uint256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getWithdrawnBalance(account);
        setWithdrawnBalance(ethers.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching withdrawn balance:", error);
      }
    }
  }

  async function getClaimableProfit() {
    if (window.ethereum && account) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = "0xYourContractAddress";
        const abi = ["function getClaimableProfit(address user) view returns (uint256)"];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const profit = await contract.getClaimableProfit(account);
        setClaimableProfit(ethers.formatUnits(profit, 18));
      } catch (error) {
        console.error("Error fetching claimable profit:", error);
      }
    }
  }

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotificationOpen(false);
  };

  // Chart data opmaken
  const monthLabels = Array.from({ length: 30 }, (_, index) => `Day ${index + 1}`);
  const paddedHistory =
    dailyProfitHistory.length < 30
      ? [...dailyProfitHistory, ...Array(30 - dailyProfitHistory.length).fill(0)]
      : dailyProfitHistory;
  // Positieve waarden krijgen nu de kleur van de create smart wallet knop
  const barColors = paddedHistory.map(value => (value >= 0 ? "#00B8FF" : "#F44336"));

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Daily Profit (USDT)",
        data: paddedHistory,
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: "#fff" } },
      y: { grid: { display: true, color: "rgba(255,255,255,0.2)" }, ticks: { color: "#fff" } }
    },
    plugins: { legend: { labels: { color: "#fff" } } }
  };

  // VIP Discount berekeningen op basis van userBalance
  const totalDeposit = parseFloat(userBalance) || 0;
  let previousThreshold = 0;
  let nextThreshold = null;
  let nextDiscount = 0;
  let needed = 0;
  let progressValueCalc = 0;

  if (totalDeposit < 2000) {
    previousThreshold = 0;
    nextThreshold = 2000;
    nextDiscount = 2;
    needed = nextThreshold - totalDeposit;
    progressValueCalc = (totalDeposit / nextThreshold) * 100;
  } else if (totalDeposit < 5000) {
    previousThreshold = 2000;
    nextThreshold = 5000;
    nextDiscount = 5;
    needed = nextThreshold - totalDeposit;
    progressValueCalc = ((totalDeposit - previousThreshold) / (nextThreshold - previousThreshold)) * 100;
  } else if (totalDeposit < 10000) {
    previousThreshold = 5000;
    nextThreshold = 10000;
    nextDiscount = 10;
    needed = nextThreshold - totalDeposit;
    progressValueCalc = ((totalDeposit - previousThreshold) / (nextThreshold - previousThreshold)) * 100;
  } else {
    nextThreshold = null;
    needed = 0;
    progressValueCalc = 100;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navbar */}
      <Navbar onNotifOpen={handleNotifOpen} />

      {/* Create Smart Wallet knop in de centrale positie */}
      <Box sx={{ display: "flex", justifyContent: "center", p: 2, mt: 3 }}>
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            fontSize: "1.2rem",
            padding: "14px 28px",
            borderRadius: "10px"
          }}
          onClick={() => {
            setNotificationMessage("Smart Wallet wordt aangemaakt...");
            setNotificationSeverity("info");
            setNotificationOpen(true);
          }}
        >
          🚀 Create Smart Wallet
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, p: 4 }}>
        {/* Cards: Profit Overview, VIP Progress, Performance Fee VIP Discount */}
        <Box
          mb={4}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          justifyContent="center"
          alignItems="center"
        >
          <Card
            sx={{
              ...glassEffect,
              padding: "1.5rem",
              textAlign: "center",
              width: 300,
              height: 160
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Profit Overview
            </Typography>
            <Typography sx={{ color: "#fff", mt: 1, fontSize: "0.875rem" }}>
              📅 Daily Profit: <strong>{dailyProfit} USDT</strong>
            </Typography>
            <Typography sx={{ color: "#fff", mt: 1, fontSize: "0.875rem" }}>
              📆 Weekly Profit: <strong>{weeklyProfit} USDT</strong>
            </Typography>
            <Typography sx={{ color: "#fff", mt: 1, fontSize: "0.875rem" }}>
              🏆 Monthly Profit: <strong>{monthlyProfit} USDT</strong>
            </Typography>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
              width: 300
            }}
          >
            <Box
              sx={{
                ...glassEffect,
                padding: "1rem",
                width: "100%",
                textAlign: "center"
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                VIP Progress
              </Typography>
              <LinearProgressWithLabel value={progressValueCalc} />
              {nextThreshold ? (
                <Typography variant="body2" sx={{ color: "#fff", mt: 1 }}>
                  You need {needed} USDT more to reach {nextDiscount}% discount
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "#fff", mt: 1 }}>
                  Maximum VIP discount reached!
                </Typography>
              )}
            </Box>
          </Box>

          <Card
            sx={{
              ...glassEffect,
              padding: "1rem",
              width: 300,
              height: 160,
              textAlign: "center"
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
              Performance Fee VIP Discount
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", mb: 0.5 }}>
              Total Investment: {userBalance} USDT
            </Typography>
          </Card>
        </Box>

        {/* Cards: Deposit, Deposited Balance, Claimable Profit, Claim Profit */}
        <Box
          mb={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          sx={{ overflowX: "auto" }}
        >
          <Card
            sx={{
              ...glassEffect,
              padding: "1rem",
              textAlign: "center",
              width: 300,
              height: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Deposit
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Min. 50 USDT"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              sx={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                input: { color: "#fff", padding: "10px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { border: "none" }
                },
                "& .MuiInputLabel-root": { color: "#fff", fontWeight: "bold" }
              }}
            />
            <Button
              variant="contained"
              sx={{
                ...buttonStyle,
                fontSize: "0.9rem",
                padding: "8px 16px",
                borderRadius: "10px"
              }}
            >
              Deposit
            </Button>
          </Card>

          <Card
            sx={{
              ...glassEffect,
              padding: "1rem",
              textAlign: "center",
              width: 300,
              height: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Deposited Balance
            </Typography>
            <Typography sx={{ color: "#fff", mt: 0.5, fontSize: "1.4rem", fontWeight: "bold" }}>
              {userBalance} USDT
            </Typography>
          </Card>

          <Card
            sx={{
              ...glassEffect,
              padding: "1rem",
              textAlign: "center",
              width: 300,
              height: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Claimable Profit
            </Typography>
            <Typography sx={{ color: "#fff", mt: 0.5, fontSize: "1.4rem", fontWeight: "bold" }}>
              {claimableProfit} USDT
            </Typography>
          </Card>

          <Card
            sx={{
              ...glassEffect,
              padding: "1rem",
              textAlign: "center",
              width: 300,
              height: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              Claim Profit
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              label="Amount (USDT)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              sx={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                input: { color: "#fff", padding: "10px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { border: "none" }
                },
                "& .MuiInputLabel-root": { color: "#fff", fontWeight: "bold" }
              }}
            />
            <Button
              variant="contained"
              sx={{
                ...buttonStyle,
                fontSize: "0.9rem",
                padding: "8px 16px",
                borderRadius: "10px"
              }}
            >
              Claim
            </Button>
          </Card>
        </Box>

        {/* Mini Chart: Daily Profit History */}
        <Box
          mb={4}
          sx={{
            ...glassEffect,
            padding: "1rem",
            height: "150px"
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Daily Profit History
          </Typography>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Container>

      {/* Snackbar notificatie */}
      <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={handleNotificationClose}>
        <Alert onClose={handleNotificationClose} severity={notificationSeverity} sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>

      {/* Notificatie Drawer */}
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={handleNotifClose}
        PaperProps={{
          sx: {
            width: 300,
            ...glassEffect,
            color: "#fff",
            p: 2
          }
        }}
      >
        <NotificationContent />
      </Drawer>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #00FFC6;
          border-radius: 3px;
        }
      `}</style>
    </ThemeProvider>
  );
}
