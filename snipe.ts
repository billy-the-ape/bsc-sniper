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

const router = new Contract(
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  ],
  account
);

const snipe = async (token: string) => {
  const tx = await router.swapExactETHForTokens(
    0, // Degen ape don't give a fuxk about slippage
    [addresses.WBNB, token],
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
  process.exit(0);
};

(async () => {
  await snipe(tokenAddress);
})();
