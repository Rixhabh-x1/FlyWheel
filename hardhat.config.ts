import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatUpgrades from "@openzeppelin/hardhat-upgrades";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatUpgrades], solidity: {
    profiles: {
      default: {
        version: "0.8.34",
      },
      production: {
        version: "0.8.34",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    robinhood: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.testnet.chain.robinhood.com",
      chainId: 46630,
      accounts: [configVariable("ROBINHOOD_PRIVATE_KEY")],
    },
    robinhoodBuyer: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.testnet.chain.robinhood.com",
      chainId: 46630,
      accounts: [configVariable("ROBINHOOD_BUYER_PRIVATE_KEY")],
    },
  },
});
