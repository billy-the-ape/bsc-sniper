import { getRouter, getTokenConfig, TokenConfig, fetchBuy } from './util';
import { Contract } from 'ethers';

process.stdin.setEncoding('utf-8');

const buyLooper = async (router: Contract, config: TokenConfig) => {
  while (true) {
    try {
      await fetchBuy(router, config);
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
};

const buyAsync = async () => {
  const config = await getTokenConfig();
  const router = getRouter(config);
  await buyLooper(router, config);

  // TODO: instead of calling snipeLooper(), check for liqudity.  If none, wait for LP transaction and then fire
  // await fetchBuy(false);
  // await snipeLooper();
};

buyAsync();
