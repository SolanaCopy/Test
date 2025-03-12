"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import Link from "next/link";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  TextField,
  DialogActions,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GradeIcon from "@mui/icons-material/Grade";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import GroupIcon from "@mui/icons-material/Group";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Line, Bar } from "react-chartjs-2";
import { ethers } from "ethers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

//
// HELPERS & STYLES
//

const defaultVaultImage = "/default-vault.jpg";

const getProfilePicture = (url) =>
  url && url.trim() !== "" ? url : defaultVaultImage;

const truncateWallet = (wallet) =>
  wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";

const getBadge = (profit) => {
  if (profit < 50) return { label: "Bronze", color: "#cd7f32" };
  if (profit < 100) return { label: "Silver", color: "#C0C0C0" };
  if (profit < 500) return { label: "Gold", color: "#FFD700" };
  return { label: "Platinum", color: "#DADADA" };
};

const topTrendingBadgeStyle = {
  fontWeight: "bold",
  fontSize: "1.2rem",
  textTransform: "uppercase",
  color: "#fff"
};

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
    color: "#fff",
    transform: "scale(1.05)"
  }
};

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

const joinAsTraderButtonStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease-in-out",
  padding: "10px 20px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "&:hover": {
    boxShadow: "0px 4px 15px #C0C0C0",
    transform: "scale(1.05)"
  }
};

const followButtonStyle = { ...buttonStyle, minWidth: "200px" };

const badgeStyleObj = (badge) => ({
  background: `linear-gradient(135deg, ${badge.color}, ${badge.color}DD)`,
  color: "#000",
  fontWeight: "bold",
  fontSize: "0.85rem",
  padding: "6px 12px",
  borderRadius: "20px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
});

//
// SOCKET & THEME
//

const socket = io("http://localhost:4000", { transports: ["websocket"] });

const theme = createTheme({
  palette: {
    primary: { main: "#00E0FF" },
    secondary: { main: "#00FFC6" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" }
  }
});

//
// COMPONENTS
//

// Common Dialog PaperProps for a darker, readable style
const dialogPaperStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 2
};

// NotificationContent Component
const NotificationContent = ({ notifications, notificationsEnabled, handleToggleNotifications }) => {
  const getNotificationIcon = (notif) => {
    switch (notif.type) {
      case "deposit":
        return <PaymentIcon sx={{ color: "#00FFC6" }} />;
      case "withdrawal":
        return <MoneyOffIcon sx={{ color: "#FF4C4C" }} />;
      case "profitClaim":
        return <AttachMoneyIcon sx={{ color: "#FFD700" }} />;
      case "badge":
        let badgeColor = "#FFD700";
        if (notif.badge === "Platinum") badgeColor = "#DADADA";
        else if (notif.badge === "Silver") badgeColor = "#C0C0C0";
        else if (notif.badge === "Bronze") badgeColor = "#cd7f32";
        return <GradeIcon sx={{ color: badgeColor }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Notifications
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
            color="secondary"
          />
        }
        label={notificationsEnabled ? "On" : "Off"}
        sx={{ mb: 2, color: "#fff" }}
      />
      {notificationsEnabled ? (
        <List
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#00FFC6",
              borderRadius: "3px"
            }
          }}
        >
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>{getNotificationIcon(notif)}</ListItemIcon>
                <ListItemText
                  primary={notif.trader}
                  secondary={notif.message}
                  primaryTypographyProps={{ fontWeight: "bold", color: "#fff" }}
                  secondaryTypographyProps={{ color: "#ccc" }}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ backgroundColor: "#333" }} />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Notifications are disabled
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Turn them on to receive updates
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ExplanationDialog Component
const ExplanationDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    PaperProps={{ sx: dialogPaperStyle }}
  >
    <DialogTitle sx={{ m: 0, p: 2, color: "#fff" }}>
      What are vaults?
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
    <DialogContent sx={{ color: "#fff" }}>
      <Typography variant="body1">
        Vaults are secure trading strategies that allow you to invest and follow expert traders.
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        They are designed to maximize profit while minimizing risk by leveraging the experience of seasoned traders.
      </Typography>
    </DialogContent>
  </Dialog>
);

// TraderDetailsDialog Component
const TraderDetailsDialog = ({ open, onClose, trader }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    PaperProps={{ sx: dialogPaperStyle }}
  >
    <DialogTitle sx={{ m: 0, p: 2, color: "#fff" }}>
      Trader Details
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
    <DialogContent dividers>
      <Box display="flex" flexDirection="column" gap={2} sx={{ color: "#fff" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Image
            src={getProfilePicture(trader.profilePicture)}
            alt="Trader"
            width={50}
            height={50}
            priority
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {trader.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
            {trader.apr}
            <span style={{ fontSize: "0.8rem", color: "#fff", marginLeft: 4 }}>
              (per 30 days)
            </span>
          </Typography>
        </Box>
        <Typography variant="body2">
          <strong>Wallet Address:</strong> {trader.walletAddress}
        </Typography>
        <Typography variant="body2">
          <strong>Trader PnL:</strong> {trader.traderPnl}
        </Typography>
        <Typography variant="body2">
          <strong>Max Drawdown:</strong> {trader.maxDrawdown}
        </Typography>
        <Typography variant="body2">
          <strong>7-Day Drawdown:</strong> {trader.sevenDayDrawdown}
        </Typography>
        <Typography variant="body2">
          <strong>Additional Stats:</strong> {trader.additionalStats || "N/A"}
        </Typography>
        <Box sx={{ width: "100%", height: "200px" }}>
          <Line data={trader.chartData} options={trader.chartOptions} />
        </Box>
      </Box>
    </DialogContent>
  </Dialog>
);

// FollowStrategyDialog Component
const FollowStrategyDialog = ({ open, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const handleConfirm = () => {
    onConfirm(amount);
    setAmount("");
    onClose();
  };
  const handleCancel = () => {
    setAmount("");
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: dialogPaperStyle }}
    >
      <DialogTitle sx={{ m: 0, p: 2, color: "#fff" }}>
        Follow Strategy
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Enter the amount in USDT you want to invest:
          </Typography>
          <TextField
            variant="outlined"
            type="number"
            placeholder="Amount in USDT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#00FFC6" }
              },
              "& .MuiInputLabel-root": { color: "#fff" }
            }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel} sx={{ color: "#fff" }}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} sx={{ ...buttonStyle, minWidth: "200px" }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ImprovedFullMonthChartDialog Component (with negative profit shown in red)
const ImprovedFullMonthChartDialog = ({ open, onClose, trader }) => {
  // Dummy daily data; replace with smart contract data if available:
  const dailyData = trader.dailyData || Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    accountBalance: Math.round(2667 + (800 / 29) * i),
    dailyProfit: i % 5 === 0 ? -1 : 1
  }));

  const monthLabels = dailyData.map(day => day.date);
  const accountBalanceData = dailyData.map(day => day.accountBalance);
  const dailyProfitData = dailyData.map(day => day.dailyProfit);

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        type: "line",
        label: "Account Balance (USDT)",
        data: accountBalanceData,
        borderColor: "#00E0FF",
        backgroundColor: "#00E0FF",
        yAxisID: "y",
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#00E0FF"
      },
      {
        type: "bar",
        label: "Daily Profit (%)",
        data: dailyProfitData,
        backgroundColor: dailyProfitData.map(value =>
          value < 0 ? "#FF4C4C" : "#4CAF50"
        ),
        yAxisID: "y1"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: "#fff" }
      },
      y: {
        type: "linear",
        position: "left",
        ticks: { color: "#fff", callback: value => `${value} USDT` },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
      y1: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: { color: "#fff", callback: value => `${value}%` }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: { color: "#fff" }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || "";
            if (label === "Account Balance (USDT)") {
              return `${context.parsed.y} USDT`;
            } else if (label === "Daily Profit (%)") {
              return `${context.parsed.y}%`;
            }
            return context.parsed.y;
          }
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: dialogPaperStyle }}
    >
      <DialogTitle sx={{ m: 0, p: 2, color: "#fff" }}>
        {trader.name} – Daily Overview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
      <DialogContent sx={{ height: 650, color: "#fff" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This chart displays the daily account balance and daily profit.
        </Typography>
        <Box sx={{ height: 350, mb: 3 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Daily Overview:
        </Typography>
        <TableContainer sx={{ maxHeight: 200 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Day</TableCell>
                <TableCell sx={{ color: "#fff" }}>Account Balance (USDT)</TableCell>
                <TableCell sx={{ color: "#fff" }}>Daily Profit (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "#fff" }}>{day.date}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{day.accountBalance}</TableCell>
                  <TableCell sx={{ color: day.dailyProfit < 0 ? "#FF4C4C" : "#fff" }}>
                    {day.dailyProfit}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

// VaultCard Component – Removed totalValue and daily change sections, added average daily ROI.
const VaultCard = ({ vault }) => {
  const [traderDialogOpen, setTraderDialogOpen] = useState(false);
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [monthlyChartOpen, setMonthlyChartOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const sampleLabels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
  const sampleData = [1, 2.5, 1.8, 3, 4.2, 4, 5.5, 6, 5.8, 6.5];
  const chartData = {
    labels: sampleLabels,
    datasets: [
      {
        label: "Growth",
        data: sampleData,
        fill: false,
        borderColor: "#4CAF50",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  };

  const badge = getBadge(vault.tradingProfit || 0);

  const handleFollowConfirm = (amount) => {
    console.log(`User follows ${vault.name} with ${amount} USDT`);
  };

  const handleFavorite = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (newFavoriteState) {
      if (!favorites.includes(vault.walletAddress)) {
        favorites.push(vault.walletAddress);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } else {
      const newFavorites = favorites.filter((fav) => fav !== vault.walletAddress);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  return (
    <>
      <Card
        onClick={() => setTraderDialogOpen(true)}
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          width: 300,
          color: "#fff",
          p: 2,
          transition: "0.3s ease",
          "&:hover": { boxShadow: "0 0 15px #C0C0C0" }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <Image
              src={getProfilePicture(vault.profilePicture)}
              alt="Trader"
              width={40}
              height={40}
              priority
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #00FFC6",
                marginRight: "8px"
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {vault.name}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            {isFavorited ? (
              <StarIcon sx={{ fontSize: 18, color: "#FFD700" }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: 18, color: "inherit" }} />
            )}
          </Box>
        </Box>

        {/* Followers section */}
        <Box display="flex" alignItems="center" mb={1}>
          <GroupIcon sx={{ color: "#fff", marginRight: "4px" }} />
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {vault.followers} followers
          </Typography>
        </Box>

        {/* Average Daily ROI section */}
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Average Daily ROI: {vault.averageDailyROI ? vault.averageDailyROI : "N/A"}%
          </Typography>
        </Box>

        <Box
          sx={{ width: "100%", height: 60, mb: 2, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setMonthlyChartOpen(true);
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Box>
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
              ROI
            </Typography>
            <Typography variant="body1" sx={{ color: "#4CAF50" }}>
              +{vault.mainROI}%
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" sx={{ color: "#fff" }}>
              (7d)
            </Typography>
            <Typography variant="body2" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
              +{vault.ROI7d}%
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" sx={{ color: "#fff" }}>
              (30d)
            </Typography>
            <Typography variant="body2" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
              +{vault.ROI30d}%
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            Drawdown (3d)
          </Typography>
          <Typography variant="body2" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
            {vault.drawdown || "N/A"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={(e) => {
              e.stopPropagation();
              setTraderDialogOpen(true);
            }}
          >
            Wallet: {truncateWallet(vault.walletAddress)}
          </Typography>
          <Typography variant="body2" sx={badgeStyleObj(badge)}>
            {badge.label}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setFollowDialogOpen(true);
            }}
            sx={{ ...buttonStyle, width: "100%" }}
          >
            Copy
          </Button>
        </Box>
      </Card>
      <TraderDetailsDialog
        open={traderDialogOpen}
        onClose={() => setTraderDialogOpen(false)}
        trader={{
          name: vault.name,
          walletAddress: vault.walletAddress,
          traderPnl: vault.traderPnl || "N/A",
          maxDrawdown: vault.maxDrawdown || "N/A",
          sevenDayDrawdown: vault.sevenDayDrawdown || "N/A",
          apr: vault.apr || "N/A",
          profilePicture: getProfilePicture(vault.profilePicture),
          additionalStats: vault.additionalStats,
          chartData: chartData,
          chartOptions: chartOptions
        }}
      />
      <FollowStrategyDialog
        open={followDialogOpen}
        onClose={() => setFollowDialogOpen(false)}
        onConfirm={handleFollowConfirm}
      />
      <ImprovedFullMonthChartDialog
        open={monthlyChartOpen}
        onClose={() => setMonthlyChartOpen(false)}
        trader={vault}
      />
    </>
  );
};

// StrategyGrid Component
const StrategyGrid = ({ strategies }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 3,
      mt: 4
    }}
  >
    {strategies.map((strategy, index) => (
      <VaultCard key={index} vault={strategy} />
    ))}
  </Box>
);

// VaultsPage Component
export default function VaultsPage() {
  const [vaults, setVaults] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, trader: "Trader ABC", type: "profitClaim", message: "claimed profit of $200" },
    { id: 2, trader: "Trader XYZ", type: "deposit", message: "deposited $500 to his account" },
    { id: 3, trader: "Trader LMN", type: "withdrawal", message: "withdrew $300 from his account" },
    { id: 4, trader: "Trader DEF", type: "badge", badge: "Gold", message: "has received a Gold badge" },
    { id: 5, trader: "Trader GHI", type: "badge", badge: "Platinum", message: "has received a Platinum badge" },
    { id: 6, trader: "Trader JKL", type: "badge", badge: "Silver", message: "has received a Silver badge" },
    { id: 7, trader: "Trader MNO", type: "badge", badge: "Bronze", message: "has received a Bronze badge" }
  ]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const contractAddress = "0xYourContractAddress";
          const contractABI = [/* Your contract ABI here */];
          const contract = new ethers.Contract(contractAddress, contractABI, provider);
          const data = await contract.getTraders();
          setVaults(data);
        } catch (error) {
          console.error("Error fetching data from smart contract", error);
        }
      } else {
        console.error("Ethereum provider not found");
      }
    }
    fetchData();
  }, []);

  const fallbackVaults = [
    {
      name: "Anjuta",
      profilePicture: "/default-vault.jpg",
      walletAddress: "0xA1B2C3D4E5F678901234567890ABCDEF12345678",
      traderPnl: "1500 USDT",
      maxDrawdown: "12%",
      sevenDayDrawdown: "5%",
      additionalStats: "Average profit per trade: 2.5%",
      tradingProfit: 75,
      totalValue: 2396,
      dailyChange: 2.26,
      mainROI: 24.56,
      ROI7d: 57.58,
      ROI30d: 8.93,
      drawdown: "3.0%",
      followers: 1000,
      averageDailyROI: 0.75
    },
    {
      name: "wizard31337",
      profilePicture: "/default-vault.jpg",
      walletAddress: "0xB2C3D4E5F678901234567890ABCDEF1234567890",
      traderPnl: "2300 USDT",
      maxDrawdown: "8%",
      sevenDayDrawdown: "3%",
      additionalStats: "Average profit per trade: 3.0%",
      tradingProfit: 250,
      totalValue: 923,
      dailyChange: 6.09,
      mainROI: 122.25,
      ROI7d: 357.13,
      ROI30d: 21.1,
      drawdown: "21.10%",
      followers: 1000,
      averageDailyROI: 1.2
    },
    {
      name: "digital trading",
      profilePicture: "/default-vault.jpg",
      walletAddress: "0xC3D4E5F678901234567890ABCDEF1234567890AB",
      traderPnl: "3200 USDT",
      maxDrawdown: "5%",
      sevenDayDrawdown: "2%",
      additionalStats: "Average profit per trade: 4.2%",
      tradingProfit: 600,
      totalValue: 686,
      dailyChange: 1.26,
      mainROI: 17.55,
      ROI7d: 52.74,
      ROI30d: 6.97,
      drawdown: "11.30%",
      followers: 1000,
      averageDailyROI: 0.9
    },
    {
      name: "Strategy 1",
      description: "Description for Strategy 1",
      pnlData: [4, 6, 5, 7, 6, 8, 5],
      followers: 300,
      tradingProfit: 50,
      apr: "40%",
      dailyPercent: "1.43%",
      profilePicture: "",
      walletAddress: "0xD4E5F678901234567890ABCDEF1234567890ABC1",
      traderPnl: "800 USDT",
      maxDrawdown: "10%",
      sevenDayDrawdown: "4%",
      additionalStats: "Average profit per trade: 2.0%",
      tvl: "$11K",
      myDeposit: "$0",
      age: "91D",
      depositors: "122",
      totalPnl: "$2,364",
      averageDailyROI: 0.65
    },
    {
      name: "Strategy 2",
      description: "Description for Strategy 2",
      pnlData: [3, 5, 4, 6, 5, 7, 4],
      followers: 250,
      tradingProfit: 30,
      apr: "35%",
      dailyPercent: "1.14%",
      profilePicture: "",
      walletAddress: "0xE5F678901234567890ABCDEF1234567890ABCDEF",
      traderPnl: "600 USDT",
      maxDrawdown: "15%",
      sevenDayDrawdown: "5%",
      additionalStats: "Average profit per trade: 1.8%",
      tvl: "$2K",
      myDeposit: "$0",
      age: "60D",
      depositors: "85",
      totalPnl: "$500",
      averageDailyROI: 0.8
    }
  ];

  const displayedVaults = vaults.length ? vaults : fallbackVaults;
  const topTrendingVaults = displayedVaults.slice(0, 3);
  const strategyProviders = displayedVaults.slice(3);

  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);
  const handleToggleNotifications = (event) => {
    const newValue = event.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", JSON.stringify(newValue));
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("notificationsEnabled");
    if (storedValue !== null) {
      setNotificationsEnabled(JSON.parse(storedValue));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar onNotifOpen={handleNotifOpen} />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, transform: "translateX(-20px)" }}>
          <Button
            sx={joinAsTraderButtonStyle}
            onClick={() => router.push("/strategy-provider")}
          >
            <span style={{ fontWeight: "bold" }}>Join as a Trader</span>
            <span style={{ fontSize: "0.8rem", marginTop: "4px" }}>
              Maximize your profits and influence now
            </span>
          </Button>
        </Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold", mb: 3, textAlign: "center" }}>
          Analyze and get an overview of every trader's profile and returns before you copy
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 1, ml: 0, textAlign: "left" }}>
            <Typography variant="h5" sx={topTrendingBadgeStyle}>
              🔥 Top Trending
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
              alignItems: "center"
            }}
          >
            {topTrendingVaults.map((vault, index) => (
              <VaultCard key={index} vault={vault} />
            ))}
          </Box>
        </Box>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 2, textAlign: "left" }}>
          All Strategy Providers
        </Typography>
        <StrategyGrid strategies={strategyProviders} />
      </Container>
      <Box sx={{ mt: "auto", py: 4, background: "#121212", textAlign: "center" }}>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          © 2025 TradingVault. All rights reserved.
        </Typography>
      </Box>
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={handleNotifClose}
        PaperProps={{
          sx: {
            width: 300,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#fff",
            p: 2
          }
        }}
      >
        <NotificationContent
          notifications={notifications}
          notificationsEnabled={notificationsEnabled}
          handleToggleNotifications={handleToggleNotifications}
        />
      </Drawer>
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
}

// Navbar Component
const Navbar = ({ onNotifOpen }) => {
  const navItems = [
    { label: "Homepage", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community Chat", path: "/community-chat" }
  ];
  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
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
          <IconButton sx={{ color: "#00FFC6" }} onClick={onNotifOpen}>
            <NotificationsIcon />
          </IconButton>
          <Button
            sx={{ ...navbarButtonStyle, fontSize: "0.85rem" }}
            onClick={() => router.push("/account")}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ParticlesBackground Component
const ParticlesBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: "#121212" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "grab" },
            resize: true
          },
          modes: {
            push: { quantity: 4 },
            grab: { distance: 140, links: { opacity: 1 } }
          }
        },
        particles: {
          color: { value: "#00FFC6" },
          links: {
            color: "#00E0FF",
            distance: 150,
            enable: true,
            opacity: 0.6,
            width: 1
          },
          collisions: { enable: false },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: false,
            speed: 2,
            straight: false
          },
          number: {
            density: { enable: true, area: 800 },
            value: 100
          },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
    />
  );
};
