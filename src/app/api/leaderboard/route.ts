// pages/api/leaderboard.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import TradeContractABI from "../../abis/TradeContractABI.json"; // Zorg dat deze file jouw contract ABI bevat

interface Trader {
  username: string;
  pnl: number;
}

// Vervang onderstaande waarden met de juiste gegevens
const CONTRACT_ADDRESS = "0xYourSmartContractAddress";
const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Maak verbinding met de blockchain via een JSON-RPC provider
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const tradeContract = new ethers.Contract(CONTRACT_ADDRESS, TradeContractABI, provider);

    // Stel een filter in voor het "TradeExecuted" event
    // Het event wordt verondersteld de volgende parameters te hebben: 
    // trader: address, pnl: int256 (of uint256 afhankelijk van je implementatie)
    const filter = tradeContract.filters.TradeExecuted();
    const events = await tradeContract.queryFilter(filter);

    // Verwerk de events om per trader de totale pnl te berekenen
    const traderPnls: Record<string, ethers.BigNumber> = {};

    events.forEach((event: any) => {
      const trader: string = event.args?.trader;
      const pnl: ethers.BigNumber = event.args?.pnl;
      if (!traderPnls[trader]) {
        traderPnls[trader] = ethers.BigNumber.from(0);
      }
      traderPnls[trader] = traderPnls[trader].add(pnl);
    });

    // Zet de berekende data om in een array van traders
    const traders: Trader[] = Object.keys(traderPnls).map((address) => ({
      username: address,
      // We gaan ervan uit dat de pnl in een Ether-achtige notatie staat,
      // pas de conversie aan indien nodig.
      pnl: parseFloat(ethers.utils.formatEther(traderPnls[address])),
    }));

    // Sorteer de traders op aflopende pnl (hoog naar laag)
    traders.sort((a, b) => b.pnl - a.pnl);

    res.status(200).json(traders);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Error fetching leaderboard data" });
  }
}
