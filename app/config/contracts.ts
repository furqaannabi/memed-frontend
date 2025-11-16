// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0x70948659559c19F58F8ab8D9B7f0b8FB8ccfC3B3",
  memedBattle: "0x0C0C34FB7a3d14fcBBC0658034faf51cd186D9Bf",
  memedBattleResolver: "0x1137E9D423C6919dD939a2DCB90DB4FA49d4aB89",
  memedEngageToEarn: "0xc1BC548658F2c156b9a98907F0326fe7E26bc0dA",
  memedTokenSale: "0xd53c38e68d54B23abdb0c7133ca87F3317E807dF",
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
