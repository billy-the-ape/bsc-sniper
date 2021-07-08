import { walletAddress, tokenAddress, wbnbAddress, txUrl } from './config.json';
import { fetchChar, getPayment, getRouter } from './util';

process.stdin.setEncoding('utf-8');

const router = getRouter();
const { bnbAmount, ...payment } = getPayment();

const snipe = async (waitForUser = true) => {
  let char = '';
  if (waitForUser) {
    console.log(
      `Sniper loaded with ${bnbAmount} rounds. Press enter to snipe, or any other key to quit`
    );
    char = await fetchChar();
  }

  if (!waitForUser || char === '\r') {
    const tx = await router.swapExactETHForTokens(
      0,
      [wbnbAddress, tokenAddress],
      walletAddress,
      Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
      payment
    );
    console.log(`Swapping BNB for tokens...`);
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${txUrl}${receipt.transactionHash}`);
    return true;
  } else {
    process.exit(0);
  }
};

const snipeLooper = async () => {
  while (true) {
    try {
      await snipe();
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
};

snipeLooper();

// TODO: instead of calling snipeLooper(), check for liqudity.  If none, wait for LP transaction and then fire
// await snipe(false);
// await snipeLooper();
