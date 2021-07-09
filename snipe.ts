import { walletAddress, tokenAddress, token } from './config.json';
import {
  fetchChar,
  getPayment,
  getRouter,
  getTokenConfig,
  TokenConfig,
} from './util';
import { Contract } from 'ethers';

process.stdin.setEncoding('utf-8');

const { bnbAmount, ...payment } = getPayment();

const snipe = async (
  router: Contract,
  { wbnbAddress, scanUrl, swapFunction }: TokenConfig,
  waitForUser = true
) => {
  let char = '';
  if (waitForUser) {
    console.log(
      `Sniper loaded with ${bnbAmount} ${token} rounds. Press enter to snipe, or any other key to quit`
    );
    char = await fetchChar();
  }

  if (!waitForUser || char === '\r') {
    const tx = await router[swapFunction](
      0,
      [wbnbAddress, tokenAddress],
      walletAddress,
      Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
      payment
    );
    console.log(`Swapping ${token} for tokens...`);
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${scanUrl}/tx/${receipt.transactionHash}`);
    return true;
  } else {
    process.exit(0);
  }
};

const snipeLooper = async (router: Contract, config: TokenConfig) => {
  while (true) {
    try {
      await snipe(router, config);
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
};

const snipeAsync = async () => {
  const config = await getTokenConfig(token);
  const router = getRouter(config);
  await snipeLooper(router, config);

  // TODO: instead of calling snipeLooper(), check for liqudity.  If none, wait for LP transaction and then fire
  // await snipe(false);
  // await snipeLooper();
};

snipeAsync();
