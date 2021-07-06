const ethers = require('ethers');
const config = require('./config.jsonc');

const addresses = {
WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
router: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
target: config.walletAddress // Change this to your address ELSE YOU GONNA SEND YOUR BEANS TO ME
}

const BNBAmount = ethers.utils.parseEther('0.1').toHexString();
const gasPrice = ethers.utils.parseUnits('10', 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 300000
}

const mnemonic = config.mnemonic;
const provider = new ethers.providers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443');
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account
);
  
  const snipe = async (token) => {
 
  const tx = await router.swapExactETHForTokens(
    0, // Degen ape don't give a fuxk about slippage
    [addresses.WBNB, token],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
    {
        ...gas,
        value: BNBAmount
    }
  );
  console.log(`Swapping BNB for tokens...`);
  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

(async () => {
  await snipe(config.tokenAddress);
})();