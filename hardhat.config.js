const fs = require("fs");
const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-truffle5");
require("dotenv").config();

const contractAddressFile = "./.contractAddress";
const getContractAddress = () => {
  return fs.readFileSync(contractAddressFile).toString();
};

task("deploy-erc721", "Deploy CommonERC721.sol").setAction(
  async (taskArgs, hre) => {
    try {
      const tokenName = process.env.TOKEN_NAME;
      const tokenSymbol = process.env.TOKEN_SYMBOL;
      const baseTokenURI = process.env.BASE_TOKEN_URI;

      const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
      const commonERC721 = await CommonERC721.deploy(
        tokenName,
        tokenSymbol,
        baseTokenURI
      );
      await commonERC721.deployed();

      fs.writeFileSync(contractAddressFile, commonERC721.address);
      console.log(
        `Contract has been deployed to ${hre.network.name}, address is: ${commonERC721.address}`
      );
    } catch (err) {
      console.log(err.reason);
    }
  }
);

task("verify-erc721", "Verify deploy_commonERC721.sol on etherscan").setAction(
  async (taskArgs, hre) => {
    try {
      await hre.run("verify:verify", {
        address: getContractAddress(),
        constructorArguments: [
          process.env.TOKEN_NAME,
          process.env.TOKEN_SYMBOL,
          process.env.BASE_TOKEN_URI,
        ],
        contract: "contracts/CommonERC721.sol:CommonERC721",
      });
    } catch (err) {
      console.log(err.reason);
    }
  }
);

task("mint", "Mint a token")
  .addParam("toaddr", 'Mint a token for "to"')
  .setAction(async (taskArgs, hre) => {
    try {
      const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
      const commonERC721 = await CommonERC721.attach(getContractAddress());

      const res = await commonERC721.mint(taskArgs.toaddr);
      const receipt = await res.wait();

      console.log(`Minted with transaction hash ${receipt.transactionHash}`);
    } catch (err) {
      console.log(err.reason);
    }
  });

task("burn", "Burn a token")
  .addParam("tokenid", "Token ID to be burned")
  .setAction(async (taskArgs, hre) => {
    try {
      const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
      const commonERC721 = await CommonERC721.attach(getContractAddress());

      const res = await commonERC721.burn(taskArgs.tokenid);
      const receipt = await res.wait();

      console.log(`Burned with transaction hash ${receipt.transactionHash}`);
    } catch (err) {
      console.log(err.reason);
    }
  });

task("pause", "Stop all action temporary").setAction(async (taskArgs, hre) => {
  try {
    const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
    const commonERC721 = await CommonERC721.attach(getContractAddress());

    const res = await commonERC721.pause();
    const receipt = await res.wait();

    console.log(`Paused with transaction hash ${receipt.transactionHash}`);
  } catch (err) {
    console.log(err.reason);
  }
});

task("pause", "Stop all action temporary").setAction(async (taskArgs, hre) => {
  try {
    const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
    const commonERC721 = await CommonERC721.attach(getContractAddress());

    const res = await commonERC721.unpause();
    const receipt = await res.wait();

    console.log(`Unpaused with transaction hash ${receipt.transactionHash}`);
  } catch (err) {
    console.log(err.reason);
  }
});

task("setRoyaltyFee", "set royaltyFee")
  .addParam("royaltyfee", "set fee / 100000")
  .setAction(async (taskArgs, hre) => {
    try {
      const CommonERC721 = await hre.ethers.getContractFactory("CommonERC721");
      const commonERC721 = await CommonERC721.attach(getContractAddress());

      const res = await commonERC721.setRoyaltyFee(taskArgs.royaltyfee);
      const receipt = await res.wait();

      console.log(`Unpaused with transaction hash ${receipt.transactionHash}`);
    } catch (err) {
      console.log(err.reason);
    }
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      hardfork: "berlin",
    },
    mumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_APIKEY,
  },
};
