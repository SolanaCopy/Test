<section className="mb-6">
<h2 className="text-2xl font-semibold">Introduction</h2>
<p>Secure Trading Vault is a decentralized trading platform designed to provide users with a secure and efficient way to trade leveraged assets while leveraging Chainlink's VRF technology for fair and transparent operations. The platform incorporates a referral system to incentivize user participation and rewards traders based on performance.</p>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Key Features</h2>
<ul className="list-disc pl-5">
    <li><strong>Leveraged Trading:</strong> Users can open leveraged positions with a maximum leverage of 30x.</li>
    <li><strong>Decentralized & Secure:</strong> Built on blockchain technology using smart contracts.</li>
    <li><strong>Chainlink VRF Integration:</strong> Ensures randomness for automated processes like auto-compounding.</li>
    <li><strong>Referral Program:</strong> Users can earn rewards by referring new traders.</li>
    <li><strong>Automated Risk Management:</strong> Implements stop-loss and take-profit mechanisms to protect traders.</li>
</ul>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Trading Mechanism</h2>
<h3 className="text-xl font-semibold">Opening Trades</h3>
<p>Users can deposit USDT to open leveraged trades, executed based on real-time price feeds from Chainlink's oracle network. Stop-loss and take-profit levels can be set to manage risks.</p>

<h3 className="text-xl font-semibold mt-4">Trade Execution</h3>
<ul className="list-disc pl-5">
    <li>Entry Price</li>
    <li>Amount Traded</li>
    <li>Leverage Multiplier</li>
    <li>Stop-Loss & Take-Profit Conditions</li>
</ul>
<p>The system ensures that slippage does not exceed 5%. Users can have multiple open trades within the platform’s smart contract. <strong>Users cannot open direct counter-orders within the same account.</strong></p>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Referral System</h2>
<p>Users earn a 20% referral fee from the trading fees of their referrals. Referral points are tracked and remain active for 30 days.</p>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Security Measures</h2>
<ul className="list-disc pl-5">
    <li><strong>Reentrancy Protection:</strong> Implemented via OpenZeppelin’s `ReentrancyGuard`.</li>
    <li><strong>Owner Privileges:</strong> Only the contract owner can update key parameters.</li>
    <li><strong>Chainlink Price Feeds:</strong> Ensures accurate asset valuation for trade execution.</li>
</ul>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Tokenomics</h2>
<ul className="list-disc pl-5">
    <li><strong>Minimum Deposit:</strong> $50 USDT</li>
    <li><strong>Performance Fee:</strong> 20% on profitable trades</li>
    <li><strong>Referral Fee:</strong> 20% of trading fees</li>
    <li><strong>Max Leverage:</strong> 30x</li>
    <li><strong>Max Slippage:</strong> 5%</li>
</ul>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Future Roadmap</h2>
<ul className="list-disc pl-5">
    <li><strong>Governance Model:</strong> Introduction of a decentralized governance mechanism.</li>
    <li><strong>Multi-Asset Support:</strong> Expansion to additional cryptocurrencies and assets.</li>
    <li><strong>Staking & Yield Farming:</strong> Enable staking options for additional rewards.</li>
</ul>
</section>

<section className="mb-6">
<h2 className="text-2xl font-semibold">Conclusion</h2>
<p>Secure Trading Vault is a decentralized and secure trading platform that integrates cutting-edge blockchain technology to provide users with a fair, transparent, and efficient trading experience. With automated risk management, referral incentives, and Chainlink VRF technology, the platform ensures fairness and profitability for all participants.</p>
</section>
</div>
);