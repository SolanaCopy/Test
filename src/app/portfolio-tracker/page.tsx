"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CssBaseline
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#0A1F44" },
    text: { primary: "#ffffff" }
  }
});

export default function PortfolioTracker() {
  const [balances, setBalances] = useState<{ day: number; balance: number }[]>([]);
  const [dailyProfits, setDailyProfits] = useState<{ day: number; profit: number }[]>([]);

  useEffect(() => {
    generateMockData();
  }, []);

  function generateMockData() {
    const startBalance = 1000;
    const days = 30;
    const monthlyGrowth = 0.20;
    const dailyGrowthAvg = monthlyGrowth / days;

    let balance = startBalance;
    let balanceData = [];
    let profitData = [];

    for (let i = 1; i <= days; i++) {
      let dailyProfit = balance * dailyGrowthAvg;

      // **Simuleer verliesdagen (elke 7e dag verlies van -0.5%)**
      if (i % 7 === 3) dailyProfit = -balance * 0.005;

      balance += dailyProfit;

      balanceData.push({ day: i, balance: Number(balance.toFixed(2)) });
      profitData.push({ day: i, profit: Number(dailyProfit.toFixed(2)) });
    }

    setBalances(balanceData);
    setDailyProfits(profitData);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ mt: 2, p: 1 }}>
        {/* 📌 Titel van de pagina */}
        <Typography variant="h4" sx={{ textAlign: "center", color: "#fff", mb: 3, fontWeight: "bold" }}>
          Portfolio Tracker
        </Typography>

        {/* 📈 Portfolio Growth Chart */}
        <Box mb={2} textAlign="center">
          <Card sx={{ background: "#1E1E2E", padding: "1rem", borderRadius: "12px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: "bold", fontSize: "1rem", mb: 1 }}>
                Portfolio Growth (1 Month)
              </Typography>

              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={balances} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.2)" />
                  <XAxis dataKey="day" stroke="#ccc" tick={{ fontSize: 10 }} domain={[1, 30]} />
                  <YAxis stroke="#ccc" tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`$${value}`, "Balance"]} />
                  <Legend wrapperStyle={{ fontSize: "10px", color: "#fff" }} />
                  <Area type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Box>

        {/* 📊 Daily Profit Chart */}
        <Box mb={2} textAlign="center">
          <Card sx={{ background: "#1E1E2E", padding: "1rem", borderRadius: "12px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: "bold", fontSize: "1rem", mb: 1 }}>
                Daily Profits (1 Month)
              </Typography>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dailyProfits} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.2)" />
                  <XAxis dataKey="day" stroke="#ccc" tick={{ fontSize: 10 }} domain={[1, 30]} />
                  <YAxis stroke="#ccc" tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} />

                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      const profit = Number(payload[0].value);
                      const isLoss = profit < 0;

                      return (
                        <div style={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: "8px",
                          borderRadius: "8px",
                          color: isLoss ? "#FF4D4D" : "#00FF00",
                          fontWeight: "bold",
                          textAlign: "center"
                        }}>
                          {isLoss ? `📉 Loss: $${Math.abs(profit).toFixed(2)}` : `📈 Profit: $${profit.toFixed(2)}`}
                        </div>
                      );
                    }}
                  />

                  <Legend wrapperStyle={{ fontSize: "10px", color: "#fff" }} />

                  <Bar dataKey="profit" name="Profit">
                    {dailyProfits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? "limegreen" : "red"} />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Box>

      </Container>
    </ThemeProvider>
  );
}
