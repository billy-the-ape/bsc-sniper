Requires node.js https://nodejs.org/en/download/

## Setup:

1. Run `npm install`
1. Add your values into the `config.json` file (see below)

### To execute one or multiple buys:

1. Run the script `npm run buy`
1. Once it has loaded, press enter to execute a buy

### To wait for liquidity pair creation and auto-buy

1. Run the script `npm run snipe`
1. It will wait until liquidity pair creation event and immediately execute a single buy when that happens.

## config.json values _YOU MUST ADD THESE_:

Copy `config.example.json` file in this folder and rename to just `config.json`. Then fill in the values for your wallet and transaction.

```jsonc
{
  "tokenAddress": "", // Token address to fetchBuy - YOU MUST ADD THIS
  "walletAddress": "", // Your BEP20 public address - YOU MUST ADD THIS
  "mnemonic": "", // Your wallet private mnemonic seed phrase - YOU MUST ADD THIS
  "bnbAmount": ".01", // Amount of BNB to spend
  "gasGwei": "10", // Gas price
  "gasLimit": 300000, // Gas limit
  "tokenConfig": "BNB" // Blockchain token config to use. See Advanced usage. Also displays this value when sniping
}
```

### config.bnb.values _ADVANCED USAGE FOR OTHER ETH FORK BLOCKCHAINS_:

Copy this file and rename to `config.<token>.json`. Then setting the `"tokenConfig"` property to that value in `config.json` will allow you to fetchBuy a different chain.

```jsonc
{
  "wbnbAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // Token address for WBNB. Do not change unless you know what you're doing.
  "routerAddress": "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router address for PCS. Do not change unless you know what you're doing.
  "factoryAddress": "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // Factory address for PCS, used to detect pair creation. Do not change unless you know what you're doing.
  "websocketUrl": "wss://bsc-ws-node.nariox.org:443", // Url for BSC websocket. Do not change unless you know what you're doing.,
  "scanUrl": "https://bscscan.com/", // Url for BSCscan for transaction url in terminal
  "buyFunction": "swapExactETHForTokens" // Function to call to perform the token swap
}
```
