// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
    AggregatorV3Interface public priceFeed;
    string public priceFeedDescription; // Public variable for currency pair

    constructor(address _priceFeed) {
        _updatePriceFeed(_priceFeed);
    }

    function setPriceFeed(address _newPriceFeed) external onlyOwner {
        require(_newPriceFeed != address(0), "Invalid address");
        _updatePriceFeed(_newPriceFeed);
    }

    function _updatePriceFeed(address _priceFeed) internal {
        priceFeed = AggregatorV3Interface(_priceFeed);
        priceFeedDescription = priceFeed.description(); // Fetch and store description
    }

    function getLatestPrice() public view returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }

     // Getter function to return the address of the priceFeed contract
    function getPriceFeed() external view returns (address) {
        return address(priceFeed);  // Convert contract to address
    }
}
