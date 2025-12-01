/**
 * Chainlink Aggregator V3 Interface ABI
 *
 * Minimal ABI for interacting with Chainlink Price Feed contracts.
 * This interface is standard across all Chainlink price feeds on all networks.
 *
 * Price Feed Addresses:
 * - Base Sepolia: 0x4aDC67696bA383F43DD60A9e78F2C356FB85a231
 * - Base Mainnet: 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70
 *
 * Returns ETH/USD price with 8 decimals precision
 * Example: $2,500.00 = 250000000000 (2500 * 10^8)
 */
export const chainlinkPriceFeedAbi = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },      // Price with 8 decimals
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },  // For staleness check
      { name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
