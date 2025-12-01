// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES ={
  "factory": "0xB1F25181Cc4F24c1ed8CD4F17AFa97D79fDe31b4",
  "memedBattle": "0x49c89addA45217b16E4fD1873E0353b0e2a7c06a",
  "memedBattleResolver": "0x76b25c9b8209f3EBb838C465a8943Fa59b7f3acF",
  "memedEngageToEarn": "0xedC01e8658b673fd2aAAD434F689dFA674Af8090",
  "memedTokenSale": "0x0e4d0A1C67201eFBF3c1B71eda6BF6F8470c61f3",

  // Chainlink ETH/USD Price Feeds (8 decimals)
  "chainlinkEthUsdSepolia": "0x4aDC67696bA383F43DD60A9e78F2C356FB85a231", // Base Sepolia testnet
  "chainlinkEthUsdMainnet": "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"  // Base Mainnet
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
export const CHAINLINK_ETH_USD_ADDRESS = CONTRACT_ADDRESSES.chainlinkEthUsdSepolia as `0x${string}`;

// To switch to Base Mainnet, uncomment the line below and comment out the line above:
// export const CHAINLINK_ETH_USD_ADDRESS = CONTRACT_ADDRESSES.chainlinkEthUsdMainnet as `0x${string}`;
