// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockAggregator is AggregatorV3Interface, Ownable {
    int256 private _price;
    uint256 private _roundId;

    // Constructor to set initial values
    constructor(int256 price, uint256 roundId) Ownable() {
        _price = price;
        _roundId = roundId;
    }

    // Implement the required functions from AggregatorV3Interface

    function latestRoundData() external view override returns (
        uint80 roundID, 
        int256 answer, 
        uint256 startedAt, 
        uint256 updatedAt, 
        uint80 answeredInRound
    ) {
        return (uint80(_roundId), _price, block.timestamp, block.timestamp, uint80(_roundId));
    }

    function getRoundData(uint80 roundId) external view override returns (
        uint80 roundID,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (roundId, _price, block.timestamp, block.timestamp, roundId);
    }

    function description() external pure override returns (string memory) {
        return "ETH/USDC";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function decimals() external pure override returns (uint8) {
        return 8; // Chainlink price feeds typically use 8 decimals
    }

    function latestTimestamp() external view  returns (uint256) {
        return block.timestamp; // Return the current block timestamp
    }

    // Optional: Allow the owner to update the price and roundId
    function updatePrice(int256 newPrice) external onlyOwner {
        _price = newPrice;
    }

    function updateRoundId(uint256 newRoundId) external onlyOwner {
        _roundId = newRoundId;
    }

    // Optional: Add a function to retrieve the current price
    function getPrice() external view returns (int256) {
        return _price;
    }

    // Optional: Add a function to retrieve the current roundId
    function getRoundId() external view returns (uint256) {
        return _roundId;
    }
}