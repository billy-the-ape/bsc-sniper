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
  const wbnbAddressLower = String(config.wbnbAddress).toLocaleLowerCase();
  const tokenAddressLower = String(tokenAddress).toLocaleLowerCase();
  // This will trigger for ALL pair creation on pancakeswap. We have to filter down for just the pair we want.
  // NOTE: This will never fetchBuy if pair is already created!
  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    let tokenIn, tokenOut;

    const token0Lower = String(token0).toLocaleLowerCase();
    const token1Lower = String(token1).toLocaleLowerCase();

    console.log(`
=================
New pair detected
token0: ${token0}
token1: ${token1}
pairAddress: ${pairAddress}
    `);

    if (token0Lower === wbnbAddressLower) {
      tokenIn = token0Lower;
      tokenOut = token1Lower;
    }

    if (token1Lower === wbnbAddressLower) {
      tokenIn = token1Lower;
      tokenOut = token0Lower;
    }

    if (typeof tokenIn === 'undefined' || tokenOut != tokenAddressLower) {
      console.log(`
This is not the pair you're looking for
=================
      `);
      return;
    }

    console.log(
      `EXPECTED PAIR FOUND with address ${pairAddress}. Sniping immediately!`
    );

    await fetchBuy(router, config, false);
    process.exit(0);
  });

  console.log(
    `Sniper loaded with ${bnbAmount} ${token} rounds.  Watching for pair creation to fire immediately...`
  );
};

const botAsync = async () => {
  const config = await getTokenConfig();
  const router = getRouter(config);
  const factory = getFactory(config);

  await bot(router, factory, config);
};

botAsync();
