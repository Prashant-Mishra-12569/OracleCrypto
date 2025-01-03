// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CryptoPriceFeed {
    AggregatorV3Interface internal btcPriceFeed;
    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal linkPriceFeed;
    AggregatorV3Interface internal bnbPriceFeed;
    AggregatorV3Interface internal ltcPriceFeed;

    constructor() {
        // Sepolia Network Price Feed Addresses
        btcPriceFeed = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
        ethPriceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        linkPriceFeed = AggregatorV3Interface(0xc59E3633BAAC79493d908e63626716e204A45EdF);
        bnbPriceFeed = AggregatorV3Interface(0x2b396ff5C5A1631E0BCCc8e3114E74B37e536526);
        ltcPriceFeed = AggregatorV3Interface(0x6Af09872f9901dfC3F3b6638C5cD76d8eE32e478);
    }

    function getAllPrices() public view returns (
        int256 btcPrice,
        int256 ethPrice,
        int256 linkPrice,
        int256 bnbPrice,
        int256 ltcPrice
    ) {
        (,btcPrice,,,) = btcPriceFeed.latestRoundData();
        (,ethPrice,,,) = ethPriceFeed.latestRoundData();
        (,linkPrice,,,) = linkPriceFeed.latestRoundData();
        (,bnbPrice,,,) = bnbPriceFeed.latestRoundData();
        (,ltcPrice,,,) = ltcPriceFeed.latestRoundData();
        
        return (btcPrice, ethPrice, linkPrice, bnbPrice, ltcPrice);
    }
}