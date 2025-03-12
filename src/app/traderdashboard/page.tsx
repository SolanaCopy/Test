"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useRouter } from "next/navigation";

// Contract details – replace with your own details
const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS";
const MAX_LEVERAGE = 10; // Maximum allowed leverage. You may also fetch this value dynamically from your contract.

// Updated ABI with extra parameters for leverage, stop loss, and take profit
const CONTRACT_ABI = [
  "function executeTrade(uint256 amount, bool isLong, uint256 leverage, uint256 stopLoss, uint256 takeProfit) external",
  "event TradeExecuted(uint256 indexed tradeId, int256 pnl)",
];

const theme = createTheme({
  palette: {
    primary: { main: "#00E0FF" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" },
  },
  typography: { fontFamily: "'Roboto', sans-serif" },
});

const inputStyles = {
  color: "#ffffff",
  "&::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "&::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "-moz-appearance": "textfield",
};

const Navbar = () => {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community", path: "/community" },
    { label: "Trade", path: "/trade" },
  ];
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Image
            src="/trading-logo.png"
            alt="Trading Logo"
            width={40}
            height={40}
            style={{ marginRight: "10px" }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                color: "#ffffff",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { backgroundColor: "#00E0FF" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={() => setShowNotifications((prev) => !prev)}
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#00E0FF" },
            }}
          >
            Notifications
          </Button>
          <Button
            onClick={() => router.push("/account")}
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#00E0FF" },
            }}
          >
            Login
          </Button>
          {showNotifications && (
            <Box
              sx={{
                position: "absolute",
                top: "60px",
                right: "110px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 2,
                color: "#ffffff",
                minWidth: "200px",
              }}
            >
              <Typography variant="body2">No new notifications.</Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const ParticlesBackground = () => {
  return (
    <Particles
      id="tsparticles"
      init={async (main) => await loadFull(main)}
      options={{
        background: { color: { value: "#121212" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "grab" },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            grab: { distance: 140, links: { opacity: 1 } },
          },
        },
        particles: {
          color: { value: "#00FFC6" },
          links: {
            color: "#00E0FF",
            distance: 150,
            enable: true,
            opacity: 0.6,
            width: 1,
          },
          collisions: { enable: false },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: false,
            speed: 2,
            straight: false,
          },
          number: { density: { enable: true, area: 800 }, value: 100 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

const TradingViewWidget = () => {
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: "5",
          timezone: "exchange",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#121212",
          enable_publishing: false,
          hide_top_toolbar: false,
          withdateranges: true,
          allow_symbol_change: true,
          container_id: "tradingview_widget",
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  return <div id="tradingview_widget" style={{ width: "100%", height: "400px" }} />;
};

const useTradeEvents = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const handleTradeExecuted = (tradeId, pnl) => {
        console.log("Trade executed:", tradeId, pnl);
        setTrades((prev) => [
          {
            tradeId: tradeId.toString(),
            pnl: pnl.toString(),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      };

      contract.on("TradeExecuted", handleTradeExecuted);

      return () => {
        contract.off("TradeExecuted", handleTradeExecuted);
      };
    }
  }, []);

  return trades;
};

const TradePage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isLong, setIsLong] = useState(true);
  const [leverage, setLeverage] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [error, setError] = useState("");

  // Monitor live TradeExecuted events
  const trades = useTradeEvents();

  const handleTrade = async () => {
    setError("");
    setTxStatus("");
    if (Number(leverage) < 0) {
      setError("Leverage cannot be negative.");
      return;
    }
    if (Number(leverage) > MAX_LEVERAGE) {
      setError(`Leverage cannot exceed ${MAX_LEVERAGE}.`);
      return;
    }
    try {
      if (!window.ethereum) {
        setError("MetaMask not found. Please install MetaMask and try again.");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const parsedAmount = ethers.utils.parseEther(amount);
      const parsedStopLoss = ethers.utils.parseEther(stopLoss);
      const parsedTakeProfit = ethers.utils.parseEther(takeProfit);
      const tx = await contract.executeTrade(
        parsedAmount,
        isLong,
        Number(leverage),
        parsedStopLoss,
        parsedTakeProfit
      );
      setTxStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      setTxStatus("Trade executed successfully!");
    } catch (err) {
      console.error(err);
      setError("An error occurred while executing the trade.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container sx={{ mt: 4, mb: 4, position: "relative", zIndex: 1 }}>
        <Typography variant="h4" align="center" sx={{ color: "#79FFF5", mb: 3, fontWeight: "bold" }}>
          Execute Trade
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {txStatus && <Alert severity="info" sx={{ mb: 2 }}>{txStatus}</Alert>}
        {/* Trade Execution Card */}
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
            p: 2,
            maxWidth: 300,
            mx: "auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            mb: 4,
          }}
        >
          <CardContent>
            <TextField
              label="Amount (USDT)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              inputProps={{
                min: 0,
                inputMode: "numeric",
              }}
              sx={{
                mb: 1,
                input: inputStyles,
                label: { color: "#ffffff", fontSize: "0.75rem" },
              }}
            />
            <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
              <Button
                variant={isLong ? "contained" : "outlined"}
                onClick={() => setIsLong(true)}
                fullWidth
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: isLong ? "#000" : "#ffffff",
                  borderColor: "#ffffff",
                }}
              >
                Long
              </Button>
              <Button
                variant={!isLong ? "contained" : "outlined"}
                onClick={() => setIsLong(false)}
                fullWidth
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  color: !isLong ? "#000" : "#ffffff",
                  borderColor: "#ffffff",
                }}
              >
                Short
              </Button>
            </Box>
            <TextField
              label="Leverage"
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              inputProps={{
                min: 0,
                inputMode: "numeric",
              }}
              sx={{
                mb: 1,
                input: inputStyles,
                label: { color: "#ffffff", fontSize: "0.75rem" },
              }}
              helperText={`Maximum ${MAX_LEVERAGE}`}
              FormHelperTextProps={{ sx: { color: "#ffffff" } }}
            />
            <TextField
              label="Stop Loss Price"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              inputProps={{
                min: 0,
                inputMode: "numeric",
              }}
              sx={{
                mb: 1,
                input: inputStyles,
                label: { color: "#ffffff", fontSize: "0.75rem" },
              }}
            />
            <TextField
              label="Take Profit Price"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              inputProps={{
                min: 0,
                inputMode: "numeric",
              }}
              sx={{
                mb: 1,
                input: inputStyles,
                label: { color: "#ffffff", fontSize: "0.75rem" },
              }}
            />
            <Button
              variant="contained"
              onClick={handleTrade}
              fullWidth
              size="small"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Execute Trade
            </Button>
          </CardContent>
        </Card>
        <TradingViewWidget />
        {/* Live Trade PnL Card */}
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
            p: 2,
            mt: 4,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                mb: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                pb: 1,
              }}
            >
              Live Trade PnL
            </Typography>
            {trades.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", color: "#fff" }}>
                No trades detected
              </Typography>
            ) : (
              <List>
                {trades.map((trade, index) => {
                  const pnlValue = parseFloat(trade.pnl);
                  const displayedPnL = pnlValue < 0 ? 0 : trade.pnl;
                  return (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Trade #${trade.tradeId}`}
                        secondary={`PnL: ${displayedPnL} - ${trade.time}`}
                        primaryTypographyProps={{ sx: { color: "#fff", fontWeight: "bold" } }}
                        secondaryTypographyProps={{ sx: { color: "#fff" } }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
      <ParticlesBackground />
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
};

export default TradePage;
