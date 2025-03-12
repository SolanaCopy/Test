"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

interface Trader {
  username: string;
  pnl: number;
}

const getRowStyle = (index: number) => {
  // Voor de top 3 kun je speciale kleuren gebruiken: goud, zilver en brons
  switch (index) {
    case 0:
      return { backgroundColor: "#ffd700" }; // goud
    case 1:
      return { backgroundColor: "#c0c0c0" }; // zilver
    case 2:
      return { backgroundColor: "#cd7f32" }; // brons
    default:
      return {};
  }
};

const Leaderboard: React.FC = () => {
  const [traders, setTraders] = useState<Trader[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data: Trader[] = await response.json();
        // Sorteer traders op PNL (hoogste eerst) en bewaar de top 10
        const sortedTraders = data.sort((a, b) => b.pnl - a.pnl);
        setTraders(sortedTraders.slice(0, 10));
      } catch (error) {
        console.error("Fout bij het ophalen van leaderboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: "1.5rem", margin: "1rem 0", borderRadius: "8px" }}>
      <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Top Traders Leaderboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Strijd mee om in de top 10 te komen!
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Trader</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                PNL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {traders.map((trader, index) => (
              <TableRow key={index} sx={{ ...getRowStyle(index), transition: "background-color 0.3s ease" }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trader.username}</TableCell>
                <TableCell align="right">{trader.pnl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard;
