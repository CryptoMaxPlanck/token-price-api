import fetch from "node-fetch";
import NodeCache from "node-cache";

import { ADDRESS_TO_CGID } from "./utils.js";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const chainNamesCoinGecko = {
  1: "ethereum",
  10: "optimistic-ethereum",
  25: "cronos",
  56: "binance-smart-chain",
  137: "polygon-pos",
  250: "fantom",
  288: "boba",
  1088: "metis",
  1284: "moonbeam",
  1285: "moonriver",
  8217: "klaytn",
  42161: "arbitrum",
  43114: "avalanche",
  53935: "dfk",
  121014925: "terra",
  1313161554: "aurora",
  1666600000: "harmony",
};
const chainNamesDefiLlama = {
  1: "ethereum",
  10: "optimism",
  25: "cronos",
  56: "bsc",
  137: "polygon",
  250: "fantom",
  288: "boba",
  1088: "metis",
  1284: "moonbeam",
  1285: "moonriver",
  8217: "klaytn",
  42161: "arbitrum",
  43114: "avalanche",
  53935: "dfk",
  121014925: "terra",
  1313161554: "aurora",
  1666600000: "harmony",
};

// Convert a date from yyyy-mm-dd format to unix timestamp
function dateToUnixTimestamp(date) {
  try {
    return new Date(date).getTime() / 1000;
  } catch (error) {
    throw new Error(`Invalid date: ${date}: ${error}`);
  }
}

// Convert a date from yyyy-mm-dd to dd-mm-yyyy
function convertDateFormat(date) {
  try {
    return date.split("-").reverse().join("-");
  } catch (error) {
    throw new Error(`Invalid date: ${date}: ${error}`);
  }
}

/**
 * @notice Get the latest price of a given coin. Uses a cache to check and update values.
 * @param {number} chainId The chain id of the coin
 * @param {string} tokenAddress The token address of the coin
 * @param {string} date The date to get the price for. Format as "yyyy-mm-dd"
 * @returns {Promise<number>} The price of the coin
 */
export async function getTokenPrice(chainId, tokenAddress, date) {
  const timestamp = dateToUnixTimestamp(date);
  const key = `${chainId}-${tokenAddress}-${timestamp}`;
  if (cache.has(key)) {
    return cache.get(key);
  }
  const queryString = JSON.stringify({
    coins: [`${chainNamesDefiLlama[chainId]}:${tokenAddress}`],
    timestamp: timestamp,
  });
  try {
    const response = await fetch("https://coins.llama.fi/prices", {
      method: "post",
      body: queryString,
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const tokenPrice = (await data)["coins"][
      `${chainNamesDefiLlama[chainId]}:${tokenAddress}`
    ]["price"];
    cache.set(key, await tokenPrice);
    return await tokenPrice;
  } catch (error) {
    try {
      let coinId = ADDRESS_TO_CGID[chainId][tokenAddress];
      if (coinId === undefined) {
        const coinIdQuery = `${chainNamesCoinGecko[chainId]}/contract/${tokenAddress}`;
        const coinIdResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinIdQuery}`
        );
        const coinIdData = await coinIdResponse.json();
        coinId = (await coinIdData)["id"];
      }
      const coinGeckoQuery = `${coinId}/history?date=${convertDateFormat(
        date
      )}`;
      const responseCoinGecko = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinGeckoQuery}`
      );
      const dataCoinGecko = await responseCoinGecko.json();
      console.log("GECKOING");
      const tokenPriceCoinGecko = (await dataCoinGecko)["market_data"][
        "current_price"
      ]["usd"];
      cache.set(key, await tokenPriceCoinGecko);
      console.log("successful gecko");
      return await tokenPriceCoinGecko;
    } catch (coinGeckoError) {
      throw new Error(`Getting errors ${error} and ${coinGeckoError}`);
    }
  }
}

// console.log(
//   await getTokenPrice(
//     8217,
//     "0xcd6f29dc9ca217d0973d3d21bf58edd3ca871a86",
//     "2022-07-07"
//   )
// );
