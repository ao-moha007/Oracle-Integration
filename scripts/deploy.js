const hre = require("hardhat");
async function main() {
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
  await oracle.waitForDeployment();
  console.log("Oracle deployed at:", oracle.address);
  if (hre.tenderly) {
    console.log("Verifying contract on Tenderly...");
    await hre.tenderly.verify({
      name: "PriceOracle",
      address: oracle.address,
    });
    console.log("Contract verified on Tenderly!");
  }

  // Deploy a mock AggregatorV3Interface to simulate a Chainlink price feed
  // const MockAggregator = await hre.ethers.getContractFactory("MockAggregator");
  // const mockPriceFeed = await MockAggregator.deploy( 2000 * 10 ** 8,1); // 2000 USD with 8 decimals
  // await mockPriceFeed.waitForDeployment();
  // console.log("mockPriceFeed address : ",await mockPriceFeed.getAddress());
  // Deploy the PriceOracle contract with the mock price feed
  // const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  // const priceOracle = await PriceOracle.deploy(await mockPriceFeed.getAddress());
  // await priceOracle.waitForDeployment();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
