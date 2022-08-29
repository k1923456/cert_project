require('dotenv').config()
const hre = require('hardhat')

const tokenName = process.env.TOKEN_NAME
const tokenSymbol = process.env.TOKEN_SYMBOL
const baseTokenURI = process.env.BASE_TOKEN_URI

async function main () {
  const accounts = await hre.ethers.getSigners()
  const NoahToken = await hre.ethers.getContractFactory('NoahToken')
  const noahToken = await NoahToken.deploy(tokenName, tokenSymbol, baseTokenURI)
  await noahToken.deployed()

  for (let i = 0; i < 5; i++) {
    const res = await noahToken.mint(accounts[0].address)
    await res.wait()
  }

  const res = await noahToken.getAlltokenIdByAddress(accounts[0].address)
  console.log(res)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
