const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("PriceOracle", function () {
    let PriceOracle, priceOracle, owner, addr1;
    let mockPriceFeed;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        // Deploy a mock AggregatorV3Interface to simulate a Chainlink price feed
        const MockAggregator = await ethers.getContractFactory("MockAggregator");
        mockPriceFeed = await MockAggregator.deploy( 2000 * 10 ** 8,1); // 2000 USD with 8 decimals
        await mockPriceFeed.waitForDeployment();
        console.log("mockPriceFeed address : ",await mockPriceFeed.getAddress());
        // Deploy the PriceOracle contract with the mock price feed
        PriceOracle = await ethers.getContractFactory("PriceOracle");
        priceOracle = await PriceOracle.deploy(await mockPriceFeed.getAddress());
        await priceOracle.waitForDeployment();

        // Store contract deployment info
        const artifact = await deployments.getArtifact("PriceOracle");
        await deployments.save("PriceOracle", {
            address: await priceOracle.getAddress(),
            abi: artifact.abi,
        });
        console.log("priceOracle address",await priceOracle.getAddress());
        //console.log("priceOracle abi",artifact.abi);
        console.log("ABI Functions:", priceOracle.interface.fragments.map(f => f.name));
        const latestPrice = await priceOracle.getLatestPrice();
        console.log("Latest Price:", latestPrice.toString());
        // const contract = await deployments.get("PriceOracle");
        // const priceOracle2 = await ethers.getContractAt("PriceOracle", contract.address);
        // const latestPriceD = await priceOracle2.getLatestPrice();
        // console.log("Latest Price:", latestPriceD.toString());


        
    });

    describe("Deployment", function () {
        it("should deploy successfully and store the price feed address", async function () {
            const contract = await deployments.get("PriceOracle");
            expect(contract.address).to.be.properAddress;
            console.log("PriceOracle contract address:", contract.address);
            //console.log("PriceOracle contract abi :", contract.abi);
        });

        it("should set the initial price feed correctly", async function () {
            const storedFeed = await priceOracle.priceFeed();
            expect(storedFeed).to.equal(await mockPriceFeed.getAddress());
        });

        it("should set the initial price feed description correctly", async function () {
            const description = await priceOracle.priceFeedDescription();
            expect(description).to.equal(await mockPriceFeed.description());
        });
    });

    describe("Price Feed Functionality", function () {
        it("should fetch the latest price correctly", async function () {
            const price = await priceOracle.getLatestPrice();
            expect(price).to.equal(2000 * 10 ** 8);
        });

        it("should allow the owner to update the price feed", async function () {
            const NewMockAggregator = await ethers.getContractFactory("MockAggregator");
            const newMockPriceFeed = await NewMockAggregator.deploy( 3000 * 10 ** 8,8); // 3000 USD
            await newMockPriceFeed.waitForDeployment();

            await priceOracle.connect(owner).setPriceFeed(await newMockPriceFeed.getAddress());

            expect(await priceOracle.priceFeed()).to.equal(await newMockPriceFeed.getAddress());
            expect(await priceOracle.priceFeedDescription()).to.equal(await newMockPriceFeed.description());
        });

        it("should revert if a non-owner tries to update the price feed", async function () {
            const NewMockAggregator = await ethers.getContractFactory("MockAggregator");
            const newMockPriceFeed = await NewMockAggregator.deploy(3000 * 10 ** 8,8);
            await newMockPriceFeed.waitForDeployment();

            await expect(
                priceOracle.connect(addr1).setPriceFeed(await newMockPriceFeed.getAddress())
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
