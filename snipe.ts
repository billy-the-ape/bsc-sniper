import { utils, providers, Wallet, Contract } from 'ethers';
import {
  walletAddress,
  bnbAmount,
  mnemonic,
  tokenAddress,
  gasGwei,
} from './config.json';

const addresses = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  router: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  target: walletAddress,
};

const BNBAmount = utils.parseEther(bnbAmount).toHexString();
const gasPrice = utils.parseUnits(gasGwei, 'gwei');
const gas = {
  gasPrice,
  gasLimit: 300000,
};

const provider = new providers.WebSocketProvider(
  'wss://bsc-ws-node.nariox.org:443'
);
const wallet = Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

process.stdin.setEncoding('utf-8');

const getChar = async () => {
  process.stdin.setRawMode(true);
  return new Promise<string>((resolve) =>
    process.stdin.once('data', (data) => {
      process.stdin.setRawMode(false);
      resolve(String(data));
    })
  );
};

const router = new Contract(
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  ],
  account
);

const snipe = async () => {
  console.log(
    'Locked and loaded. Press enter to snipe, or any other key to quit'
  );
  const char = await getChar();

  if (char === '\r') {
    const tx = await router.swapExactETHForTokens(
      0, // Degen ape don't give a fuxk about slippage
      [addresses.WBNB, tokenAddress],
      addresses.target,
      Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
      {
        ...gas,
        value: BNBAmount,
      }
    );
    console.log(`Swapping BNB for tokens...`);
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.transactionHash}`);
  } else {
    process.exit(0);
  }
};

// Get rid of previous logs
console.clear();

(async () => {
  while (true) {
    try {
      await snipe();
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
})();
