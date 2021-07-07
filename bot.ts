import { utils, providers, Wallet, Contract } from 'ethers';
import {
  walletAddress,
  bnbAmount,
  mnemonic,
  tokenAddress,
  gasGwei,
  ankrWebsocketUrl,
} from './config.json';

const addresses = {
  WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  router: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  target: walletAddress,
}

//Ethers was originally created for Ethereum, both also work for BSC
//'ether' === 'bnb' on BSC
const BNBAmount = utils.parseUnits(bnbAmount, 'ether');
const gasPrice = utils.parseUnits(gasGwei, 'gwei');
const gas = {
  gasPrice,
  gasLimit: 300000,
};

const provider = new providers.WebSocketProvider(ankrWebsocketUrl);
const wallet = Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

const factory = new Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);

const router = new Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);

const wbnb = new Contract(
  addresses.WBNB,
  [
    'function approve(address spender, uint amount) public returns(bool)',
  ],
  account
);

const init = async () => {
  const tx = await wbnb.approve(
    router.address,
    '1', //Replace by amount covering several trades
  );
  const receipt = await tx.wait();
  console.log('Transaction receipt');
  console.log(receipt);
}

factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);

  //The quote currency needs to be WBNB (we will pay with WBNB)
  let tokenIn, tokenOut;
  if (token0 === addresses.WBNB) {
    tokenIn = token0;
    tokenOut = token1;
  }

  if (token1 == addresses.WBNB) {
    tokenIn = token1;
    tokenOut = token0;
  }

  //The quote currency is not WBNB
  if (typeof tokenIn === 'undefined') {
    return;
  }

  //The token does not match what you want
  if (tokenOut != tokenAddress) {
    return;
  }

  const amountIn = BNBAmount;
  const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  //Our execution price will be a bit different, we need some flexbility
  const amountOutMin = amounts[1].sub(amounts[1].div(10));
  console.log(`
    Buying new token
    =================
    tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
    tokenOut: ${amountOutMin.toString()} ${tokenOut}
  `);

  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [tokenIn, tokenOut],
    addresses.target,
    Date.now() + 1000 * 60 * 10, //10 minutes
    {
      ...gas
    }
  );
  const receipt = await tx.wait();
  console.log('Transaction receipt');
  console.log(receipt);
});

init();