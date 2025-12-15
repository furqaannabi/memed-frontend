// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0x7B42121256e2B6b22A1951bf3878272e2D6e5e48",
  memedBattle: "0x5165391F2a4fB1765A9393B53019339b948A3112",
  memedBattleResolver: "0x84029bE463c6bCFf47b61486704f73a29f7984c5",
  memedEngageToEarn: "0xA89609233f67D2fDB98C6569Ea1B81DDD59B7A31",
  memedTokenSale: "0xA05B10bd64d47C8d183B2ca8D1Dedd42Cc987380",


  // Chainlink ETH/USD Price Feeds (8 decimals)
  chainlinkEthUsdSepolia: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // Base Sepolia testnet - from explorer
  chainlinkEthUsdMainnet: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // Base Mainnet
} as const;

// It's also useful to export them individually for direct import
export const FACTORY_ADDRESS = CONTRACT_ADDRESSES.factory;
export const BATTLE_ADDRESS = CONTRACT_ADDRESSES.memedBattle;
export const BATTLE_RESOLVER_ADDRESS = CONTRACT_ADDRESSES.memedBattleResolver;
export const ENGAGE_TO_EARN_ADDRESS = CONTRACT_ADDRESSES.memedEngageToEarn;
export const TOKEN_SALE_ADDRESS = CONTRACT_ADDRESSES.memedTokenSale;

// Payment token for fair launch commitments (LEGACY - Now using native ETH)
export const PAYMENT_TOKEN_ADDRESS =
  "0xc190e6F26cE14e40D30251fDe25927A73a5D58b6" as const;

// Chainlink ETH/USD Price Feed Address
// Currently using Base Sepolia for development
export const CHAINLINK_ETH_USD_ADDRESS =
  CONTRACT_ADDRESSES.chainlinkEthUsdSepolia as `0x${string}`;

// To switch to Base Mainnet, uncomment the line below and comment out the line above:
// export const CHAINLINK_ETH_USD_ADDRESS = CONTRACT_ADDRESSES.chainlinkEthUsdMainnet as `0x${string}`;
