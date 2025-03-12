// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <title>TradingVault</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
