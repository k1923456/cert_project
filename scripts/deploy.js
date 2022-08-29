const hre = require("hardhat");
require("dotenv").config();
const tokenName = process.env.TOKEN_NAME;
const tokenSymbol = process.env.TOKEN_SYMBOL;
const baseTokenURI = process.env.BASE_TOKEN_URI;

async function main() {
  const NoahToken = await hre.ethers.getContractFactory("CommonERC721");
  const noahToken = await NoahToken.deploy(
    tokenName,
    tokenSymbol,
    baseTokenURI
  );

  await noahToken.deployed();

  console.log("CommonERC721 deployed to:", noahToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
