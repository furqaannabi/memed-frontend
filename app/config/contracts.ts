// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0x4632920F33f62C59cbB8baf7740A96C384B4698a",
  memedBattle: "0xC8734fF910661b91E20b7430c6e517e1d594be97",
  memedBattleResolver: "0xbF1FE4cF68fb540c3Fb0393349a97668B34342D6",
  memedEngageToEarn: "0x10d1f4E102A9cbE0D77f355a10A81B61FB6437Ab",
  memedTokenSale: "0x2de10D81c76cd38606D2623031C8B2b8dA0A74Dc",
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
