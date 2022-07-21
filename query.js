// const NodeCache = require('node-cache');
import fetch from "node-fetch";
import cache from "./cache.js";

let chainNames = {};

async function updateChainNamesQuery() {
  await fetch("https://api.llama.fi/chains")
    .then((res) => res.json())
    .then((data) => {
      Object.entries(data).forEach((entry) => {
        const [_, chainElement] = entry;
        if (chainElement["gecko_id"] && chainElement["chainId"]) {
          chainNames[chainElement["chainId"]] = chainElement["gecko_id"];
        }
      });
    });
}

// Convert a date from Y-m-d format to unix timestamp
function dateToUnixTimestamp(date) {
  return new Date(date).getTime() / 1000;
}

/**
 * @notice Get the latest price of a given coin. Uses a cache to check and update values.
 * @param {number} chainId The chain id of the coin
 * @param {string} tokenAddress The token address of the coin
 * @param {string} date The date to get the price for. Format as "YYYY-mm-dd"
 * @param {boolean} updateChainNames If true, the chain names will be updated. By default, this is false.
 * @returns {Promise<number>} The price of the coin
 */
export async function getTokenPrice(
  chainId,
  tokenAddress,
  date,
  updateChainNames = false
) {
  if (Object.keys(chainNames).length === 0 || updateChainNames) {
    await updateChainNamesQuery();
  }
  const timestamp = dateToUnixTimestamp(date);
  const key = `${chainId}-${tokenAddress}-${timestamp}`;
  if (cache.has(key)) {
    console.log("cached");
    return cache.get(key);
  }
  const query_string = JSON.stringify({
    coins: [`${chainNames[chainId]}:${tokenAddress}`],
    timestamp: timestamp,
  });
  const tokenPrice = await fetch("https://coins.llama.fi/prices", {
    method: "post",
    body: query_string,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then(
      (data) => data["coins"][`${chainNames[chainId]}:${tokenAddress}`]["price"]
    );
  cache.set(key, tokenPrice);
//   if (cache.has(key)) {
//     console.log("cached");
//     return cache.get(key);
//   }
  return tokenPrice;
}

console.log(
  await getTokenPrice(
    "1",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "2022-07-20"
  )
);
console.log(
    await getTokenPrice(
        "1",
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "2022-07-20"
      )
)
// await getTokenPrice("1", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "2022-07-20");
