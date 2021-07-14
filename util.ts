import { Contract, providers, utils, Wallet } from 'ethers';
import {
  bnbAmount,
  gasGwei,
  gasLimit,
  token,
  mnemonic,
  tokenAddress,
  walletAddress,
} from './config.json';

export const fetchChar = async () => {
  process.stdin.setRawMode(true);
  return new Promise<string>((resolve) =>
    process.stdin.once('data', (data) => {
      process.stdin.setRawMode(false);
      resolve(String(data));
    })
  );
};

export type TokenConfig = {
  wbnbAddress: string;
  routerAddress: string;
  factoryAddress: string;
  websocketUrl: string;
  scanUrl: string;
  buyFunction: string;
};

export const getTokenConfig = async (): Promise<TokenConfig> => {
  return await import(`./config.${token}.json`);
};

let _account: Wallet;

export const getAccount = (websocketUrl: string) => {
  if (_account) return _account;

  const provider = new providers.WebSocketProvider(websocketUrl);
  const wallet = Wallet.fromMnemonic(mnemonic);
  _account = wallet.connect(provider);

  return _account;
};

export const getFactory = ({ websocketUrl, factoryAddress }: TokenConfig) => {
  const account = getAccount(websocketUrl);
  return new Contract(
    factoryAddress,
    [
      'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
    ],
    account
  );
};

export const getRouter = ({
  websocketUrl,
  routerAddress,
  buyFunction,
}: TokenConfig) => {
  const account = getAccount(websocketUrl);

  return new Contract(
    routerAddress,
    [
      `function ${buyFunction}(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)`,
    ],
    account
  );
};

export const getPayment = () => {
  const value = utils.parseEther(bnbAmount).toHexString();
  const gasPrice = utils.parseUnits(gasGwei, 'gwei');
  return {
    gasPrice,
    gasLimit,
    value,
    bnbAmount,
  };
};

export const fetchBuy = async (
  router: Contract,
  { wbnbAddress, scanUrl, buyFunction }: TokenConfig,
  waitForUser = true
) => {
  const { bnbAmount, ...payment } = getPayment();
  let char = '';
  if (waitForUser) {
    console.log(
      `Sniper loaded with ${bnbAmount} ${token} rounds. Press enter to fetchBuy, or any other key to quit`
    );
    char = await fetchChar();
  } else {
    console.log(`Sniper firing with ${bnbAmount} ${token} rounds.`);
  }

  if (!waitForUser || char === '\r') {
    const tx = await router[buyFunction](
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

export const fetchSell = async (
  router: Contract,
  { wbnbAddress, scanUrl, buyFunction }: TokenConfig,
  waitForUser = true
) => {
  const { bnbAmount, ...payment } = getPayment();
};
