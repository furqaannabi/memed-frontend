// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0xD4bAA3b338312163feFE276174fA5408eA77106e",
  memedBattle: "0xA1F38109840f1219C5EC997119e52d65C965be4E",
  memedBattleResolver: "0x1AF5696b8c625379532C871f6941FDcf73E14BF2",
  memedEngageToEarn: "0xf68419E84A65e104C58444Ed8aA4E3BfFba66409",
  memedTokenSale: "0x56ba7Dd356CDbc8c7121e148B8E2502aF8197904",
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
