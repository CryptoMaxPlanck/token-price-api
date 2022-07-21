import fetch from "node-fetch";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

let chainNames = {};

// Update the Object connecting chainId's to their gecko_id
async function updateChainNamesQuery() {
  try {
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
  } catch (error) {
    throw new Error(`Error updating chain names: ${error}`);
  }
}

// Convert a date from Y-m-d format to unix timestamp
function dateToUnixTimestamp(date) {
  try {
    return new Date(date).getTime() / 1000;
  } catch (error) {
    throw new Error(`Invalid date: ${date}: ${error}`);
  }
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
    return cache.get(key);
  }
  const query_string = JSON.stringify({
    coins: [`${chainNames[chainId]}:${tokenAddress}`],
    timestamp: timestamp,
  });
  try {
    const tokenPrice = await fetch("https://coins.llama.fi/prices", {
      method: "post",
      body: query_string,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(
        (data) =>
          data["coins"][`${chainNames[chainId]}:${tokenAddress}`]["price"]
      );
    cache.set(key, tokenPrice);
    return tokenPrice;
  } catch (error) {
    throw new Error(error);
  }
}
