Requires node.js https://nodejs.org/en/download/

## How to use:

1. Run `yarn install` or `npm install`
1. Add your values into the `config.json` file
1. Run the script with `yarn snipe` or `npm run snipe`
1. Get rich

### config.json values:

```jsonc
{
  "bnbAmount": ".01", // Amount of BNB to spend
  "gasGwei": "10", // Gas price
  "tokenAddress": "", // Token address to snipe - YOU MUST ADD THIS
  "walletAddress": "", // Your BEP20 public address - YOU MUST ADD THIS
  "mnemonic": "", // Your wallet private mnemonic seed phrase - YOU MUST ADD THIS
  "wbnbAddress": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // Token address for WBNB. Do not change unless you know what you're doing.
  "routerAddress": "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router address for PCS. Do not change unless you know what you're doing.
  "websocketUrl": "wss://bsc-ws-node.nariox.org:443" // Url for BSC websocket. Do not change unless you know what you're doing.
}
```
