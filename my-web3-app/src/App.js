import { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';

import './App.css';

import basicContractInfo from "./contracts/basic.json"
import marketContractInfo from "./contracts/market.json"

const marketContractAddress = "0x2eec478d5bC75Ad49E43Bdf5C9715fDdacf8eb53";
const basicContractAddress = "0x9bb57b37d3e3FDCd853EE2b98fBf171e4C6a05Ad"
const basicAbi = basicContractInfo.abi;
const marketAbi = marketContractInfo.abi

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
        const contract = new ethers.Contract(basicContractAddress, basicAbi, signer);
        console.log("initialize your payment...")

        let txn = await contract.mintNft();

        // console.log(`your nft's token id is ${tokenId}`)
        console.log("minting the NFT, please wait...");

        // await txn.wait(1);

        const receipt = await txn.wait(1)
        const tokenId = receipt.events[0].args.tokenId;

        console.log(`success minted! your nft tokenID is: ${tokenId}`)

        console.log(`you can view the transaction on etherscan:https://rinkeby.etherscan.io/tx/${txn.hash}`);
        
      } else {
        console.log("ethereum object doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
   }
  
  const listNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(currentAccount)
        const signer = provider.getSigner();
        
        const marketContract = new ethers.Contract(marketContractAddress,marketAbi,signer)
        const basicContract = new ethers.Contract(basicContractAddress,basicAbi,signer)
        
        const tokenId = "0x09"
        const price = ethers.utils.parseEther("0.001")

        const approvalTxn = await basicContract.connect(currentAccount).approve(marketContract.address, tokenId)
        await approvalTxn.wait(1)

        console.log("listing your nft...")

        const tx = await marketContract.connect(currentAccount).listItem(basicContractAddress,tokenId,price)
        await tx.wait(1)
        console.log("NFT Listed with token ID: ", tokenId.toString())

        const mintedBy = await basicContract.ownerOf(tokenId)
        console.log(`NFT with ID ${tokenId} minted and listed by owner ${mintedBy}}.`)
      } else {
        console.log("ethereum object does not exist...")
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

  const listNFTButton = () => {
    return (
      <button onClick={listNftHandler} className='cta-button list-nft-button'>
        List NFT
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
      <h1>nft market place</h1>
      <div>
        {listNFTButton()}
      </div>
    </div>
  )
}

export default App;