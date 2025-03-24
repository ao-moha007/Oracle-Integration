# Price Oracle Smart Contract

# Overview
The PriceOracle contract retrieves and provides real-time price data using Chainlink oracles. It allows the contract owner to update the price feed source dynamically.

# Features
Fetch Live Price Data: Retrieves the latest price from the Chainlink AggregatorV3Interface.

Supports Multiple Price Feeds: The owner can update the oracle source.

Price Feed Description: Stores the description of the currency pair (e.g., ETH/USD).

Access Control: Only the owner can change the price feed.
