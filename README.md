# token-price-api
Query crypto token prices with use of a local, in-memory cache.

Import the package by running ```npm i token-price-api``` or ```yarn add token-price-api```.

Then, in the code, import the package with ```import getTokenPrice from "token-price-api";``` and call the function with ```await getTokenPrice(<chainId>, <tokenAddress>, <yyy-mm-dd>)```.
