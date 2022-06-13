import { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';

import './App.css';

import contract from "./contracts/learn_event.json"

const contractAddress = "0x2eec478d5bC75Ad49E43Bdf5C9715fDdacf8eb53";
const abi = contract.abi;



function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("make sure you have metamask installed!");
      return;
    } else {
      console.log("wallet existed! we are ready to go!");
    }

    const  accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length !==0 ) {
      const account = accounts[0];
      console.log("Found a authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("no authorized account found")
    }
   }

  const connectWalletHandler = async () => {
    const { ethereum } = window

    if (!ethereum) {
      alert("please install metamask");
    }
    
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      console.log("found a account! address:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
   }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        let txn = await nftContract.deposit(1);
        console.log("listing the item, please wait...");
        await txn.wait();
        
        console.log(`ok your listing is added now, you can view the transaction on etherscan:https://rinkeby.etherscan.io/tx/${txn.hash}`);
      } else {
        console.log("ethereum object doesn't exist")
      }
    } catch (err) {
      console.log(err)
    }
   }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }
  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>test</h1>
      <div>
        {/* {connectWalletButton()} */}
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;