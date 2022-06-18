# initialize

npx create-remix my-web3-apps
cd my-web3-apps

npm i web3 json-stringify-safe react-json-pretty

# run
npm run dev

# moralis

I put a listen on my nft market place contract:

https://rtfdn635smk1.usemoralis.com:2083/apps/moralisDashboard/browser/itemListed

where all the listed items will be recorded as an archive with real-time updates.

# web3 usages:

## 1. send transactions 

```solidity
var contractInstance = new web3.eth.Contract(abi, _contractAddress);

// use .send() to send the transaction to the blockchain and change state
contractInstance.methods.changeString('new string').send({ from: _yourAccount })
  .then(receipt => { /** some action **/ });

```

# problem solved 

## 1.  web3.eth.getNodeInfo is not a function
https://ethereum.stackexchange.com/questions/22983/web3-eth-contract-is-not-a-function-when-making-contract

use higher version of web3

## references

https://blog.chain.link/how-to-build-an-nft-marketplace-with-hardhat-and-solidity/

https://dev.to/yakult/how-to-use-web3-react-to-develop-dapp-1cgn

https://betterprogramming.pub/how-to-use-web3-js-to-interact-with-the-ethereum-virtual-machine-in-remix-f4923b18e707