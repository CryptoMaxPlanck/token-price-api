import { expect } from "chai";
import getTokenPrice from "../index.js";

// describe("Get Token Price Tests", async () => {
const dateToQuery = "2022-07-07";
const MISSING_TOKENS_MAP = {
  "0x2b4618996fad3ee7bc9ba8c98969a8eaf01b5e20":
    "0x130025ee738a66e691e6a7a62381cb33c6d9ae83",
  "0x7f0a733b03ec455cb340e0f6af736a13d8fbb851":
    "0x130025ee738a66e691e6a7a62381cb33c6d9ae83",
  "0xf2001b145b43032aaf5ee2884e456ccd805f677d":
    "0x396c9c192dd323995346632581bef92a31ac623b",
  "0xa565037058df44f336e01683e096cdde45cfe5c2":
    "0xe3c82a836ec85311a433fbd9486efaf4b1afbf48",
  "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab":
    "0x19e1ae0ee35c0404f835521146206595d37981ae",
  "0x4f60a160d8c2dddaafe16fcc57566db84d674bd6":
    "0x997ddaa07d716995de90577c123db411584e5e46",
  "0x72cb10c6bfa5624dd07ef608027e366bd690048f":
    "0x28b42698caf46b4b012cf38b6c75867e0762186d",
  "0x6983d1e6def3690c4d616b13597a09e6193ea013":
    "0x0b5740c6b4a97f90ef2f0220651cca420b868ffb",
  "0xb12c13e66ade1f72f71834f2fc5082db8c091358":
    "0xd9eaa386ccd65f30b77ff175f6b52115fe454fd6",
};
const tokensToTest = {
  // ethereum
  1: [
    "0x71ab77b7dbb4fa7e017bc15090b2163221420282",
    "0x0f2d719407fdbeff09d87557abb7232601fd9f29",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "0x6b175474e89094c44da98b954eedeac495271d0f",
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
    "0x853d955acef822db058eb8505911ed77f175b99e",
    "0xca76543cf381ebbb277be79574059e32108e3e65",
    "0x0ab87046fbb341d058f17cbc4c1133f25a20a52f",
    "0x98585dfc8d9e7d48f0b1ae47ce33332cf4237d96",
    "0x73968b9a57c6e53d41345fd57a6e6ae27d6cdb2f",
    "0x0261018aa50e28133c1ae7a29ebdf9bd21b878cb",
    "0xa8d7f5e7c78ed0fa097cc5ec66c1dc3104c9bbeb",
    "0xb753428af26e81097e7fd17f40c88aaa3e04902c",
    "0x0642026e7f0b6ccac5925b4e7fa61384250e1701",
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  ],
  // bsc
  56: [
    "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    "0xaa88c603d142c371ea0eac8756123c5805edee03",
    "0xa4080f1778e69467e905b8d6f72f6e441f9e9484",
    "0x5f4bde007dc06b867f86ebfe4802e34a1ffeed63",
    "0x55d398326f99059ff775485246999027b3197955",
    "0x0fe9778c005a5a6115cbe12b0568a2d50b765a51",
    "0x42f6f551ae042cbe50c739158b4f0cac0edb9096",
    "0xc13b7a43223bb9bf4b69bd68ab20ca1b79d81c75",
    "0x88918495892baf4536611e38e75d771dc6ec0863",
    "0xb7a6c5f0cc98d24cf4b2011842e64316ff6d042c",
  ],
  // polygon
  137: [
    "0xf8f9efc0db77d8881500bb06ff5d6abc3070e695",
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    "0x0a5926027d407222f8fe20f24cb16e103f617046",
    "0xd8ca34fd379d9ca3c6ee3b3905678320f5b45195",
    "0xeee3371b89fc43ea970e908536fcddd975135d8a",
    "0x48a34796653afdaa1647986b33544c911578e767",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "0x565098cba693b3325f9fe01d41b7a1cd792abab1",
    "0xc5248aa0629c0b2d6a02834a5f172937ac83cbd3",
  ],
  // avalanche
  43114: [
    "0x1f1e7c893855525b303f99bdf5c3c05be09ca251",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xc7198437980c041c805a1edcba50c1ce5db95118",
    "0xf1293574ee43950e7a8c9f1005ff097a9a713959",
    "0x19e1ae0ee35c0404f835521146206595d37981ae",
    "0x321e7092a180bb43555132ec53aaa65a5bf84251",
    "0xcc5672600b948df4b665d9979357bef3af56b300",
    "0x53f7c5869a859f0aec3d334ee8b4cf01e3492f21",
    "0x62edc0692bd897d2295872a9ffcac5425011c661",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x20a9dc684b4d0407ef8c9a302beaaa18ee15f656",
    "0x4bfc90322dd638f81f034517359bd447f8e0235a",
    "0xccbf7c451f81752f7d2237f2c18c371e6e089e69",
    "0x997ddaa07d716995de90577c123db411584e5e46",
    "0xe97097de8d6a17be3c39d53ae63347706dcf8f43",
    "0xc2bf0a1f7d8da50d608bc96cf701110d4a438312",
  ],
  // arbitrum
  42161: [
    "0x080f6aed32fc474dd5717105dba5ea57268f46eb",
    "0x3ea9b0ab55f34fb188824ee288ceaefc63cf908e",
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    "0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1",
    "0x85662fd123280827e11c59973ac9fcbe838dc3b4",
    "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
    "0x0877154a755b24d499b8e2bd7ecd54d3c92ba433",
    "0x1a4da80967373fd929961e976b4b53ceec063a15",
    "0x13780e6d5696dd91454f6d3bbc2616687fea43d0",
    "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    "0xa684cd057951541187f288294a1e1c2646aa2d24",
    "0x087d18a77465c34cdfd3a081a2504b7e86ce4ef8",
  ],
  // fantom
  250: [
    "0xe55e19fb4f2d85af758950957714292dac1e25b2",
    "0x82f0b8b456c1a451378467398982d4834b6829c1",
    "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    "0x91fa20244fb509e8289ca630e5db3e9166233fdc",
    "0x1852f70512298d56e9c8fdd905e02581e04ddb2a",
    "0x67c10c397dd0ba417329543c1a40eb48aaa7cd00",
    "0x74b23882a30290451a17c44f4f05243b6b58c76d",
    "0xe3c82a836ec85311a433fbd9486efaf4b1afbf48",
    "0xa0554607e477cdc9d0ee2a6b087f4b2dc2815c22",
  ],
  // harmony
  1666600000: [
    "0xe55e19fb4f2d85af758950957714292dac1e25b2",
    "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
    "0x985458e523db3d53125813ed68c274899e9dfab4",
    "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
    "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
    "0x1852f70512298d56e9c8fdd905e02581e04ddb2a",
    "0xfa7191d292d5633f702b0bd7e3e3bccc0e633200",
    "0x67c10c397dd0ba417329543c1a40eb48aaa7cd00",
    "0x0b5740c6b4a97f90ef2f0220651cca420b868ffb",
    "0xe3c82a836ec85311a433fbd9486efaf4b1afbf48",
    "0xd9eaa386ccd65f30b77ff175f6b52115fe454fd6",
    "0x28b42698caf46b4b012cf38b6c75867e0762186d",
    "0xa0554607e477cdc9d0ee2a6b087f4b2dc2815c22",
    "0xa9ce83507d872c5e1273e745abcfda849daa654f",
  ],
  // boba
  288: [
    "0xb554a55358ff0382fb21f0a478c3546d1106be8c",
    "0xf74195bb8a5cf652411867c5c2c5b8c2a402be35",
    "0x5de1677344d3cb0d7d465c10b72a8f60699c062d",
    "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc",
    "0x96419929d7949d6a801a6909c145c8eef6a40431",
    "0xd203de32170130082896b4111edf825a4774c18e",
    "0xd22c0a4af486c7fa08e282e9eb5f30f9aaa62c95",
    "0x61a269a9506272d128d79abfe8e8276570967f00",
    "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
  ],
  // moonriver
  1285: [
    "0xd80d8688b02b3fd3afb81cdb124f188bb5ad0445",
    "0xe96ac70907fff3efee79f502c985a7a21bce407d",
    "0x3bf21ce864e58731b6f28d68d5928bcbeb0ad172",
    "0x76906411d07815491a5e577022757ad941fb5066",
    "0x98878b06940ae243284ca214f92bb71a2b032b8a",
    "0x1a93b23281cc1cde4c4741353f3064709a16197d",
    "0xa9d0c0e124f53f4be1439ebc35a9c73c0e8275fb",
  ],
  //optimism
  10: [
    "0x5a5fff6f753d7c11a56a52fe47a177a87e431655",
    "0x809dc529f07651bd43a172e8db6f4a7a0d771036",
    "0x121ab82b49b2bc4c7901ca46b8277962b4350204",
    "0x0b5740c6b4a97f90ef2f0220651cca420b868ffb",
    "0x931b8f17764362a3325d30681009f0edd6211231",
    "0xfb21b70922b9f6e3c6274bcd6cb1aa8a0fe20b80",
    "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
  ],
  // aurora
  1313161554: [
    "0xd80d8688b02b3fd3afb81cdb124f188bb5ad0445",
    "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
    "0x4988a896b1227218e4a686fde5eabdcabd91571f",
    "0xb1da21b0531257a7e5aefa0cd3cbf23afc674ce1",
  ],
  // moonbeam
  1284: [
    "0xf44938b0125a6662f9536281ad2cd6c499f22004",
    "0x0db6729c03c85b0708166ca92801bcb5cac781fc",
    "0xd2666441443daa61492ffe0f37717578714a4521",
    "0xdd47a348ab60c61ad6b60ca8c31ea5e00ebfab4f",
    "0x3192ae73315c3634ffa217f71cf6cbc30fee349a",
    "0xbf180c122d85831dcb55dc673ab47c8ab9bcefb4",
    "0x1d4c2a246311bb9f827f4c768e277ff5787b7d7e",
    "0xa1f8890e39b4d8e33efe296d698fe42fb5e59cc3",
    "0x5cf84397944b9554a278870b510e86667681ff8d",
  ],
  // cronos
  25: [
    "0xfd0f80899983b8d46152aa1717d76cba71a31616",
    "0xbb0a63a6ca2071c6c4bcac11a1a317b20e3e999c",
    "0xc21223249ca28397b4b6541dffaecc539bff0c59",
  ],
  // metis
  1088: [
    "0xfb21b70922b9f6e3c6274bcd6cb1aa8a0fe20b80",
    "0x67c10c397dd0ba417329543c1a40eb48aaa7cd00",
    "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
    "0x931b8f17764362a3325d30681009f0edd6211231",
    "0x420000000000000000000000000000000000000a",
    "0x0b5740c6b4a97f90ef2f0220651cca420b868ffb",
  ],
  // dfk
  53935: [
    "0xb57b60debdb0b8172bb6316a9164bd3c695f133a",
    "0xccb93dabd71c8dad03fc4ce5559dc3d89f67a260",
    "0x9596a3c6a4b2597adcc5d6d69b281a7c49e3fe6a",
    "0x77f2656d04e158f915bc22f07b779d94c1dc47ff",
    "0xb6b5c854a8f71939556d4f3a2e5829f7fcc1bf2a",
    "0x3ad9dfe640e1a9cc1d9b0948620820d975c3803a",
    "0x360d6dd540e3448371876662fbe7f1acaf08c5ab",
  ],
  // klaytn
  8217: [
    "0x078db7827a5531359f6cb63f62cfa20183c4f10c",
    "0x6270b58be569a7c0b8f47594f191631ae5b2c86c",
    "0xd6dab4cff47df175349e6e7ee2bf7c40bb8c05a3",
    "0xdcbacf3f7a069922e677912998c8d57423c37dfa",
    "0xcd6f29dc9ca217d0973d3d21bf58edd3ca871a86",
    "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167",
    "0xf5f3650f54da85e4a4d8e490139c77275b167c53",
  ],
};
// Object.keys(tokensToTest).forEach((chain) => {
  const chain = "1666600000";
  describe("Testing chain: " + chain, async () => {
    tokensToTest[parseInt(chain)].forEach((token) => {
      it(`should return the correct price for ${token}`, async () => {
        if (MISSING_TOKENS_MAP[token] !== undefined) {
          const price = await getTokenPrice(
            parseInt(chain),
            MISSING_TOKENS_MAP[token],
            dateToQuery
          );
          console.log("MISSING ", price);
          expect(price).to.be.a("number");
        }
        const price = await getTokenPrice(parseInt(chain), token, dateToQuery);
        console.log(price);
        expect(price).to.be.a("number");
      });
    });
  });
// });