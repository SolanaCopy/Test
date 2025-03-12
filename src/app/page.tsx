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
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GradeIcon from "@mui/icons-material/Grade";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Explanation icons for "How It Works" cards
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PaidIcon from "@mui/icons-material/Paid";

// Additional icons for CardSlider slides
import SecurityIcon from "@mui/icons-material/Security";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import ShieldIcon from "@mui/icons-material/Shield";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

// Material UI Accordion icon for FAQ
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// React Slick and slick-carousel CSS (if needed)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ChartJS and Line component (if needed)
import { Line } from "react-chartjs-2";
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

// Socket.IO connection
const socket = io("http://localhost:4000", { transports: ["websocket"] });

// Utility functions
const truncateWallet = (wallet: string) =>
  wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";
const getBadge = (profit: number) => {
  if (profit < 50) return { label: "Bronze", color: "#cd7f32" };
  if (profit < 100) return { label: "Silver", color: "#C0C0C0" };
  if (profit < 500) return { label: "Gold", color: "#FFD700" };
  return { label: "Platinum", color: "#DADADA" };
};

// Standard styles for buttons and navbar
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

const followButtonStyle = { ...buttonStyle, minWidth: "200px" };

// Theme definition
const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontWeightBold: 700
  },
  palette: {
    primary: { main: "#00E0FF" },
    secondary: { main: "#00FFC6" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" }
  }
});

/* ------------------------- ParticlesBackground Component ------------------------- */
const ParticlesBackground = () => {
  const particlesInit = async (main: any) => {
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
          modes: { push: { quantity: 4 }, grab: { distance: 140, links: { opacity: 1 } } }
        },
        particles: {
          color: { value: "#00FFC6" },
          links: { color: "#00E0FF", distance: 150, enable: true, opacity: 0.6, width: 1 },
          collisions: { enable: false },
          move: { direction: "none", enable: true, outModes: { default: "out" }, random: false, speed: 2, straight: false },
          number: { density: { enable: true, area: 800 }, value: 100 },
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

/* ------------------------- Navbar Component ------------------------- */
const Navbar = ({ onNotifOpen }: { onNotifOpen: () => void }) => {
  const navItems = [
    { label: "Homepage", path: "/" },
    { label: "Account", path: "/account" },
    { label: "Traders", path: "/traders" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Community Chat", path: "/community-chat" },
    { label: "Strategy Provider", path: "/strategy-provider", special: true }
  ];
  const router = useRouter();
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
              <Button
                sx={{
                  ...(item.special ? buttonStyle : navbarButtonStyle),
                  fontSize: "0.85rem"
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton sx={{ color: "#00FFC6", zIndex: 150 }} onClick={onNotifOpen}>
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

/* ------------------------- CardSlider Component ------------------------- */
function CardSlider() {
  const slides = [
    {
      title: "Professional Trading",
      description:
        "Experience the benefits of professional trading via PancakeSwap Futures, with advanced risk management to maximize your profit potential while minimizing risks.",
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Automated Profit Reinvestment",
      description:
        "Your profits are automatically reinvested using Chainlink VRF, ensuring consistent portfolio growth without additional effort.",
      icon: <AutorenewIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Safe & Transparent",
      description:
        "All transactions are recorded on-chain and verified, so you can rely on complete transparency and security for your investments.",
      icon: <SecurityIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Effortless Passive Income",
      description:
        "Discover the power of passive income without prior trading experience. Deposit USDT and let our advanced system work for you.",
      icon: <MonetizationOnIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Exclusive VIP Discounts",
      description:
        "The greater your investment, the more you save. Benefit from exclusive discounts of up to 10% and optimize your returns.",
      icon: <StarIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Attractive Referral Rewards",
      description:
        "Refer friends and earn up to 20% of the trading fees they generate. Build an additional income stream while expanding your network.",
      icon: <GroupAddIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Withdraw Anytime – Full Control",
      description:
        "Maintain complete control over your finances. Withdraw your profits at any time, with no restrictions or hidden fees.",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Real-Time Price Validation",
      description:
        "Our trades are validated using advanced Chainlink Oracles, ensuring you always have access to the most accurate pricing data.",
      icon: <PriceChangeIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Intelligent Risk Management",
      description:
        "Benefit from built-in Stop-Loss and Take-Profit mechanisms, specifically designed to protect your capital in any market condition.",
      icon: <ShieldIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    },
    {
      title: "Start Trading & Earning Today",
      description:
        "Join Secure Trading Vault and experience the future of trading. Deposit USDT and start generating passive income in a professional manner immediately.",
      icon: <RocketLaunchIcon sx={{ fontSize: 50, color: "#00FFC6" }} />
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <Box sx={{ position: "relative", overflow: "hidden", width: "100%", height: "400px" }}>
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: 0,
            left: `${(index - currentSlide) * 100}%`,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "left 0.5s ease-in-out",
            padding: 2,
            borderRadius: "20px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.5)"
          }}
        >
          {slide.icon}
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {slide.title}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, maxWidth: "80%", textAlign: "center", fontWeight: 700 }}>
            {slide.description}
          </Typography>
        </Box>
      ))}
      <Button
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "none",
          boxShadow: "none",
          color: "#00FFC6",
          fontSize: "2rem",
          minWidth: "auto",
          zIndex: 2,
          "&:hover": { background: "none", color: "#00B8FF" }
        }}
      >
        &#10094;
      </Button>
      <Button
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "none",
          boxShadow: "none",
          color: "#00FFC6",
          fontSize: "2rem",
          minWidth: "auto",
          zIndex: 2,
          "&:hover": { background: "none", color: "#00B8FF" }
        }}
      >
        &#10095;
      </Button>
    </Box>
  );
}

/* ------------------------- NotificationContent Component ------------------------- */
const NotificationContent = ({
  notifications,
  notificationsEnabled,
  handleToggleNotifications
}: {
  notifications: any[];
  notificationsEnabled: boolean;
  handleToggleNotifications: (e: any) => void;
}) => {
  const getNotificationIcon = (notif: any) => {
    switch (notif.type) {
      case "deposit":
        return <PaymentIcon sx={{ color: "#00FFC6", mr: 1 }} />;
      case "withdrawal":
        return <MoneyOffIcon sx={{ color: "#FF4C4C", mr: 1 }} />;
      case "profitClaim":
        return <AttachMoneyIcon sx={{ color: "#FFD700", mr: 1 }} />;
      case "badge":
        let badgeColor = "#FFD700";
        if (notif.badge === "Platinum") badgeColor = "#DADADA";
        else if (notif.badge === "Silver") badgeColor = "#C0C0C0";
        else if (notif.badge === "Bronze") badgeColor = "#cd7f32";
        return <GradeIcon sx={{ color: badgeColor, mr: 1 }} />;
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
        control={<Switch checked={notificationsEnabled} onChange={handleToggleNotifications} color="secondary" />}
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
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#00FFC6", borderRadius: "3px" }
          }}
        >
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem alignItems="center">
                {getNotificationIcon(notif)}
                <ListItemText
                  sx={{ ml: 2 }}
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
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

/* ------------------------- HomePage Component ------------------------- */
export default function HomePage() {
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState(1);
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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count);
    });
    return () => {
      socket.off("connect");
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    const storedValue = localStorage.getItem("notificationsEnabled");
    if (storedValue !== null) {
      setNotificationsEnabled(JSON.parse(storedValue));
    }
  }, []);

  const handleNotifOpen = () => setNotifOpen(true);
  const handleNotifClose = () => setNotifOpen(false);
  const handleToggleNotifications = (e: any) => {
    const newValue = e.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", JSON.stringify(newValue));
  };

  // Explanation items for "How It Works"
  const explanationItems = [
    {
      title: "Smart Contract Execution",
      description: "Trades are executed via a decentralized smart contract for full automation and security.",
      icon: <GavelIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "User-Managed Accounts",
      description: "Users create their own accounts on the smart contract with no owner interference.",
      icon: <PersonIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Smart Copy Trading",
      description: "Follow one or multiple tailored investment strategies with ease and precision.",
      icon: <FileCopyIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Direct Trade Execution",
      description: "Traders execute trades directly via the smart contract to PancakeSwap Futures.",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Profit Reinvestment",
      description: "Profits are returned to the smart contract and automatically reinvested for growth.",
      icon: <AutorenewIcon sx={{ fontSize: 40, color: "#ccc" }} />
    },
    {
      title: "Fee Distribution",
      description: "Users incur a 10% fee per claim and traders incur a 15% fee, supporting the platform.",
      icon: <PaidIcon sx={{ fontSize: 40, color: "#ccc" }} />
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticlesBackground />
      <Navbar onNotifOpen={handleNotifOpen} />
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center", px: { xs: 2, sm: 4 } }}>
        {/* Hero Section */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: { xs: "3.5rem", md: "5rem" },
            background: "linear-gradient(90deg, #00FFC6, #00E0FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "4px",
            mb: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.6)"
          }}
        >
          Smart Copy Trading
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: "#fff",
            fontWeight: 500,
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
            letterSpacing: "1px"
          }}
        >
          Automated Trading, Secure Profits, and Passive Income – All in One Platform.
        </Typography>
      </Container>
      {/* Statistics Card */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.5)",
            padding: 4,
            borderRadius: "16px"
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Followers
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              12,345
            </Typography>
          </Box>
          {/* Center box: Total Invested */}
          <Box sx={{ textAlign: "center", ml: "-1cm" }}>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Total Invested
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              $678,900
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>
              Traders
            </Typography>
            <Typography variant="h4" sx={{ color: "#00FFC6", mt: 1, fontWeight: 900 }}>
              987
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* Top Strategy Managers */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: "20px", textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            fontSize: { xs: "1.8rem", md: "2.5rem" }
          }}
        >
          Meet our top performing strategy managers
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <CardSlider />
      </Container>
      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
          How It Works
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {explanationItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  background: "rgba(30, 30, 30, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.5)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": { boxShadow: "0 0 15px silver" }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: "#00FFC6" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.8 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "#fff",
            textTransform: "uppercase",
            textAlign: "center",
            mb: 4
          }}
        >
          FAQ
        </Typography>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              What is Expert Trading?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Trades are executed on PancakeSwap Futures with advanced risk management to maximize profits and minimize risks.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              How does Automated Profit Reinvestment work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Your profits are automatically reinvested using Chainlink VRF, ensuring consistent growth of your portfolio.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              How secure and transparent is the platform?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              All transactions are recorded on-chain and verifiable, providing complete transparency and security for your investments.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              Is Smart Copy Trading suitable for beginners?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              No prior trading experience is required. Deposit USDT and let our automated system manage your trades and grow your capital.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel5a-content"
            id="panel5a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              What are VIP Discounts?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              The larger your investment, the more you save! Enjoy exclusive discounts of up to 10% to maximize your returns.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel6a-content"
            id="panel6a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              How do Referral Rewards work?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Earn up to 20% of your referrals’ trading fees when they join and deposit. Expand your network and create an extra income stream.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel7a-content"
            id="panel7a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              Can I withdraw my funds anytime?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Your funds remain fully under your control. Withdraw your profits at any time without restrictions or hidden fees.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel8a-content"
            id="panel8a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              How is price data validated?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              All trades are validated using advanced Chainlink Oracles, ensuring that you receive the most accurate price information.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel9a-content"
            id="panel9a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              What is Intelligent Risk Management?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Each trade is equipped with Stop-Loss and Take-Profit mechanisms to safeguard your capital in volatile market conditions.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "rgba(30, 30, 30, 0.7)", backdropFilter: "blur(10px)", color: "#fff", mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#00FFC6" }} />}
            aria-controls="panel10a-content"
            id="panel10a-header"
          >
            <Typography variant="h6" sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
              How do I start trading and earning?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "700", fontSize: "1.1rem", lineHeight: 1.5 }}>
              Join Secure Trading Vault, deposit USDT, and experience next-level trading to start earning passive income immediately.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      {/* Footer */}
      <Box
        sx={{
          mt: "auto",
          py: 4,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          textAlign: "center"
        }}
      >
        <Typography variant="body1" sx={{ color: "#fff" }}>
          © 2025 TradingVault. All rights reserved.
        </Typography>
      </Box>
      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={handleNotifClose}
        PaperProps={{
          sx: {
            width: 300,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </ThemeProvider>
  );
}
