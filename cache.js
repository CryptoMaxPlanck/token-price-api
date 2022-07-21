import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 1000, checkperiod: 50 });

export default cache;