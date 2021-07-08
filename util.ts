import { Contract, providers, utils, Wallet } from 'ethers';
import { bnbAmount, gasGwei, gasLimit, token, mnemonic } from './config.json';

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
  websocketUrl: string;
  scanUrl: string;
};

export const getTokenConfig = async (token: string): Promise<TokenConfig> => {
  return await import(`./config.${token}.json`);
};

export const getRouter = ({ websocketUrl, routerAddress }: TokenConfig) => {
  const provider = new providers.WebSocketProvider(websocketUrl);
  const wallet = Wallet.fromMnemonic(mnemonic);
  const account = wallet.connect(provider);

  const router = new Contract(
    routerAddress,
    [
      'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    ],
    account
  );
  return router;
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
