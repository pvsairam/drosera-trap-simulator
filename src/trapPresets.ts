const INFURA_KEY = import.meta.env.VITE_INFURA_KEY;

export const trapPresets = [
  {
    label: "Low ETH Balance Alert",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });
  const balance = await provider.getBalance("0x00000000219ab540356cBB839Cbe05303d7705Fa");

  return {
    ethBalance: Number(ethers.formatEther(balance)),
    timestamp: Date.now()
  };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.ethBalance < 10;
}`
  },

  {
    label: "High ETH Balance Alert",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });
  const balance = await provider.getBalance("0x00000000219ab540356cBB839Cbe05303d7705Fa");

  return {
    ethBalance: Number(ethers.formatEther(balance)),
    timestamp: Date.now()
  };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.ethBalance > 1000;
}`
  },

  {
    label: "Chainlink BTC Price Drop",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });

  const abi = ["function latestAnswer() view returns (int256)"];
  const chainlinkBTC = new ethers.Contract(
    "0xf4030086522a5beea4988f8ca5b36dbc97bee88c",
    abi,
    provider
  );

  const price = await chainlinkBTC.latestAnswer();
  return {
    btcPrice: Number(price) / 1e8,
    timestamp: Date.now()
  };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.btcPrice < 20000;
}`
  },

  {
    label: "Uniswap ETH/USDC Pool TVL Drop",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });

  const abi = ["function getReserves() view returns (uint112, uint112, uint32)"];
  const pair = new ethers.Contract(
    "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    abi,
    provider
  );

  const [reserve0, reserve1] = await pair.getReserves();
  const tvl = Number(ethers.formatUnits(reserve0, 6)) + Number(ethers.formatUnits(reserve1, 18));
  return { tvlUSD: tvl };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.tvlUSD < 1000000;
}`
  },

  {
    label: "Lido Staked ETH Slashing Risk (AVS Slashing Detection)",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });

  const abi = ["function getTotalPooledEther() view returns (uint256)"];
  const lido = new ethers.Contract("0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", abi, provider);
  const totalPooled = await lido.getTotalPooledEther();

  return {
    totalStakedETH: Number(ethers.formatEther(totalPooled)),
    timestamp: Date.now()
  };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.totalStakedETH < 4000000;
}`
  },

  {
    label: "StETH / ETH Peg Analysis (Restaking Economic Analysis)",
    collect: `async function collect() {
  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "${INFURA_KEY}"
  });

  const abi = ["function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)"];
  const curvePool = new ethers.Contract("0xDC24316b9AE028F1497c275EB9192a3Ea0f67022", abi, provider);

  const stethToEth = await curvePool.get_dy(0, 1, ethers.parseEther("1"));
  const ratio = Number(ethers.formatEther(stethToEth));
  return { pegRatio: ratio };
}`,
    shouldRespond: `function shouldRespond(state) {
  return state.pegRatio < 0.98 || state.pegRatio > 1.02;
}`
  }
];
