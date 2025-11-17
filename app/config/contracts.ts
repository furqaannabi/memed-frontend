// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0xC2867b1557e587c8e88f62cC3bfAc2304535aA2f",
  memedBattle: "0x61905b655938267d792b8Ed05Af84e1aaFfdCf53",
  memedBattleResolver: "0x47d48445c0Fa847DB5dAb91193568e161BD4d417",
  memedEngageToEarn: "0x2198e30AAA3E6A20dC40c399AE59F8F858288C2d",
  memedTokenSale: "0xabD5EBD3D9Faa18a5518D5E9303ceB5E0bC2EAF9",
} as const;

// It's also useful to export them individually for direct import
export const FACTORY_ADDRESS = CONTRACT_ADDRESSES.factory;
export const BATTLE_ADDRESS = CONTRACT_ADDRESSES.memedBattle;
export const BATTLE_RESOLVER_ADDRESS = CONTRACT_ADDRESSES.memedBattleResolver;
export const ENGAGE_TO_EARN_ADDRESS = CONTRACT_ADDRESSES.memedEngageToEarn;
export const TOKEN_SALE_ADDRESS = CONTRACT_ADDRESSES.memedTokenSale;

// Payment token for fair launch commitments
export const PAYMENT_TOKEN_ADDRESS =
  "0xc190e6F26cE14e40D30251fDe25927A73a5D58b6" as const;
