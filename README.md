Requires node.js https://nodejs.org/en/download/

## How to use:

1. Run `yarn install` or `npm install`
1. Register your own BSC mainnet API (token based) at ankr.com
1. Add your values into the `config.json` file
1. Run the snipe script with `yarn snipe` or `npm run snipe`
1. Run the buy bot script with `yarn bot` or `npm run bot`
1. Get rich

### config.json values:

```jsonc
{
  "bnbAmount": ".01", // Amount of BNB to spend
  "gasGwei": "10", // Gas price
  "tokenAddress": "", // Token address to snipe
  "walletAddress": "", // Your BEP20 public address
  "mnemonic": "", // Your wallet private mnemonic seed phrase
  "ankrWebsocketUrl": "" //Ankr wss API to listen to events
}
```
