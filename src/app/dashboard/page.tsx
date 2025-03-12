"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ethers } from "ethers";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CssBaseline,
  AppBar,
  Toolbar,
  LinearProgress
} from "@mui/material";
import Image from "next/image";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#0A1F44" },
    text: { primary: "#ffffff" }
  }
});

// Custom SVG Copy Icon (geen extra installatie nodig)
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export default function Dashboard() {
  const [account, setAccount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [totalDeposited, setTotalDeposited] = useState(3500);
  const [dailyProfit, setDailyProfit] = useState(120);
  const [weeklyProfit, setWeeklyProfit] = useState(840);
  const [monthlyProfit, setMonthlyProfit] = useState(3600);
  const [totalProfit, setTotalProfit] = useState(15000);
  const [investmentDuration, setInvestmentDuration] = useState("6 months");
  const referralLink = "https://securetradingvault.com/ref?user=12345";

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
      } catch (error) {
        console.error("Error connecting wallet:", error);
        router.push("/");
      }
    } else {
      alert("Metamask is not installed!");
      router.push("/");
    }
  }

  function disconnectWallet() {
    setAccount("");
    router.push("/");
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navbar met Routing */}
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image src="/trading-logo.png" alt="Trading Logo" width={40} height={40} style={{ marginRight: "10px" }} />
          </Box>

          {/* Navbar items gecentreerd */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {[
              { name: "Homepage", path: "/" },
              { name: "Account", path: "/account" },
              { name: "Portfolio Tracker", path: "/portfolio-tracker" },
              { name: "Whitepaper", path: "/whitepaper" },
              { name: "Traders", path: "/Traders" },
              { name: "Leaderboard", path: "/leaderboard" },
              { name: "Community Chat", path: "/community-chat" }
            ].map((item) => (
              <Button
                key={item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  color: pathname === item.path ? "#FFD700" : "#fff",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Disconnect-knop */}
          <Button
            onClick={disconnectWallet}
            sx={{
              fontSize: "0.85rem",
              padding: "6px 12px",
              borderRadius: "8px",
              color: "#ff4d4d",
              border: "2px solid #ff4d4d",
              background: "transparent",
              "&:hover": {
                background: "#ff4d4d",
                color: "#fff"
              }
            }}
          >
            Disconnect
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard Titel */}
      <Typography variant="h4" sx={{ textAlign: "center", color: "#fff", mt: 2, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      {/* Create Smart Wallet Button */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #FFD700, #FF8C00)",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "14px 28px",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(255, 215, 0, 0.5)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(45deg, #FF8C00, #FFD700)",
              transform: "scale(1.05)"
            }
          }}
          onClick={() => alert("Smart Wallet wordt aangemaakt...")}
        >
          🚀 Create Smart Wallet
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, p: 4 }}>
        {/* Profit Overview Card */}
        <Box mb={4} textAlign="center">
          <Card sx={{ background: "#1E1E2E", padding: "1.5rem", borderRadius: "12px", textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: "bold" }}>
                Profit Overview
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                📅 Daily Profit: <strong>{dailyProfit} USDT</strong>
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                📆 Weekly Profit: <strong>{weeklyProfit} USDT</strong>
              </Typography>
              <Typography sx={{ color: "#ccc", mt: 1 }}>
                🏆 Monthly Profit: <strong>{monthlyProfit} USDT</strong>
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Deposit & Claim Profit Cards */}
        <Grid container spacing={3}>
          {/* Deposit Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: "#1E1E2E", padding: "1.5rem", borderRadius: "12px", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff" }}>Deposit</Typography>
                <TextField
                  fullWidth
                  label="Min. 50 USDT"
                  sx={{ input: { color: "#fff" }, label: { color: "#fff" }, mt: 1 }}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button variant="contained" sx={{ mt: 2 }}>
                  Deposit
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Claim Profit Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: "#1E1E2E", padding: "1.5rem", borderRadius: "12px", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#fff" }}>Claim Profit</Typography>
                <TextField
                  fullWidth
                  label="Amount (USDT)"
                  sx={{ input: { color: "#fff" }, label: { color: "#fff" }, mt: 1 }}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button variant="contained" sx={{ mt: 2 }}>
                  Claim
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
