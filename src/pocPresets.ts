// src/pocPresets.ts
export const pocPresets = [
  {
    label: "📉 Oracle Price Drop",
    logic: `async function trap(event) {
  if (event.asset === "BTC" && event.oraclePrice < 20000) {
    return "📉 Oracle price dropped significantly!";
  }
}`,
    event: `{
  "type": "oracle",
  "asset": "BTC",
  "oraclePrice": 19500,
  "timestamp": ${Date.now()}
}`
  },
  {
    label: "⚔️ AVS Slashing",
    logic: `async function trap(event) {
  if (event.avs === "staking" && event.slashAmount > 5000) {
    return "⚔️ AVS slashing triggered!";
  }
}`,
    event: `{
  "type": "slashing",
  "avs": "staking",
  "slashAmount": 6000,
  "timestamp": ${Date.now()}
}`
  },
  {
    label: "🛑 DEX Liquidity Drop",
    logic: `async function trap(event) {
  if (event.pool === "DEX-XYZ" && event.liquidityUSD < 1000000) {
    return "🛑 Liquidity has dropped dangerously low on DEX!";
  }
}`,
    event: `{
  "type": "liquidity",
  "pool": "DEX-XYZ",
  "liquidityUSD": 800000,
  "timestamp": ${Date.now()}
}`
  },
  {
    label: "🏦 Lending Collateral Event",
    logic: `async function trap(event) {
  if (event.collateralRatio < 1.2 && event.loanId) {
    return "🏦 Lending collateral ratio below threshold!";
  }
}`,
    event: `{
  "type": "loan",
  "loanId": "LN-1234",
  "collateralRatio": 1.1,
  "timestamp": ${Date.now()}
}`
  }
];
