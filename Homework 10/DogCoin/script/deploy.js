const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DogCoin = await hre.ethers.getContractFactory("DogCoin");
  const dogCoin = await DogCoin.deploy();

  console.log("Token address:", dogCoin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
