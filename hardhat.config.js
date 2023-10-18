require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */

const POLYEDGE_RPC_URL = process.env.POLYEDGE_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    pixel: {
      url: POLYEDGE_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 903010,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31313,
    },
  },
  etherscan: {
    apiKey: {
      pixel: "83e6b32d-4466-4ff8-ad90-16c9b68be4ba",
    },
    customChains: [
      {
        network: "pixel",
        chainId: 903010,
        urls: {
          apiURL: "https://scan.pixelsoftwares.com/api",
          browserURL: "https://scan.pixelsoftwares.com",
        },
      },
    ],
  },
  solidity: "0.8.0",
}
