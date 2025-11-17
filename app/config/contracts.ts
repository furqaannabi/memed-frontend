// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0xc774FA42a93316f39b9b504FC07Cc7DFe6Fa2a70",
  memedBattle: "0x89d102a8Fa7B93e82028EEEDD25A74640f94C383",
  memedBattleResolver: "0x87f758B26b28d0D8eF2368bF3005adB270ffE8ad",
  memedEngageToEarn: "0xF199a97287dc69aC77391E6E3a0Bb824B1FDEB61",
  memedTokenSale: "0x3E53e1f9a4526745871B77F6A73797e0395C4997",
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
