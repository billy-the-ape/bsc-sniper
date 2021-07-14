import { Contract } from 'ethers';
import { bnbAmount, tokenAddress, token } from './config.json';
import {
  getFactory,
  getRouter,
  getTokenConfig,
  TokenConfig,
  fetchBuy,
} from './util';

const bot = async (
  router: Contract,
  factory: Contract,
  config: TokenConfig
) => {
  // This will trigger for ALL pair creation on pancakeswap. We have to filter down for just the pair we want.
  // NOTE: This will never fetchBuy if pair is already created!
  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    let tokenIn, tokenOut;

    if (token0 === config.wbnbAddress) {
      tokenIn = token0;
      tokenOut = token1;
    }

    if (token1 === config.wbnbAddress) {
      tokenIn = token1;
      tokenOut = token0;
    }

    if (typeof tokenIn === 'undefined') {
      // wbnb is not part of the pair
      return;
    }

    if (tokenOut != tokenAddress) {
      // token to fetchBuy is not part of the pair
      return;
    }

    console.log(
      `New pair detected with address ${pairAddress}. Firing at will!`
    );

    await fetchBuy(router, config, false);
    process.exit(0);
  });

  console.log(
    `Sniper loaded with ${bnbAmount} ${token} rounds.  Waiting for pair creation to fire immediately...`
  );
};

const botAsync = async () => {
  const config = await getTokenConfig();
  const router = getRouter(config);
  const factory = getFactory(config);

  await bot(router, factory, config);
};

botAsync();
while (true) {}
