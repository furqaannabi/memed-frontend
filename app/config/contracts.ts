// =================================================================================
// Contract Addresses
// =================================================================================

// The following addresses are for the Base Sepolia testnet.
// TODO: Add addresses for other networks as needed.

export const CONTRACT_ADDRESSES = {
  factory: "0xd779CD499b11CCF692A0f655a408e370f13640f6",
  memedBattle: "0xaBEDE18b8b77C585f21C9009188f2E7d163d6944",
  memedBattleResolver: "0xd6c96Af324169c61F7c4D28E20d226faC170ec94",
  memedEngageToEarn: "0x9fdd7fd21f430e8dc72bd04944f9534A8A4EF60c",
  memedTokenSale: "0x790266D5573d0B6587CCda0Bb32bE50A0F3cfBE0",
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
