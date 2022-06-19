import { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from 'antd'; 
import { get } from 'axios'

import './App.css';
import marketContractInfo from "./contracts/market.json"

// import connectWalletHandler from './components/todo';

const marketContractAddress = "0x427A1B98971941F7AeC2405f02bF1F819A8e3F82";
// const basicContractAddress = "0x9bb57b37d3e3FDCd853EE2b98fBf171e4C6a05Ad"

const marketAbi = marketContractInfo.abi

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [price, setPrice] = useState(null);
  const apiKey = "R4IMSY2FIN2KV3ZV34SXU77SWCM2T7WJ5X";
  const url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`
  const inputAddress = (value) => {
    setAddress(value.target.value);
    console.log(address);
  }
  const inputTokenId = (value) => {
    setTokenId(value.target.value);
    console.log(tokenId);
  }
  const inputPrice = (value) => {
    setPrice(value.target.value);
    console.log(price);
  }
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
        let res = await get(url)
        console.log(res)
        const basicAbi = JSON.parse(res.data.result)
        console.log(basicAbi)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, basicAbi, signer);
        console.log("initialize your payment...")

        let txn = await contract.mintNft();

        // console.log(`your nft's token id is ${tokenId}`)
        console.log("minting the NFT, please wait...");

        // await txn.wait(1);

        const receipt = await txn.wait(1)
        const tokenId = receipt.events[0].args.tokenId;
        console.log(tokenId)

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
        let resAbi = await get(url)
        const basicAbi = JSON.parse(resAbi.data.result)
        console.log(basicAbi)
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(currentAccount)
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(marketContractAddress,marketAbi,signer)
        const basicContract = new ethers.Contract(address,basicAbi,signer)
        
        // const tokenId = "0x0d"
        // const price = ethers.utils.parseWei("0.001")

        // approvalTxn here is important
        // we ask users to give approval on marketplace to take control of this token id
        // the approve function can be found here: https://eips.ethereum.org/EIPS/eip-721
        const approvalTxn = await basicContract.connect(signer).approve(marketContract.address, tokenId)
        await approvalTxn.wait(1)

        const getApproved = basicContract.getApproved(tokenId)
        console.log(getApproved)

        console.log("listing your nft...")

        const tx = await marketContract.connect(signer).listItem(address,tokenId,price)
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

  const cancelNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let resAbi = await get(url)
        const basicAbi = JSON.parse(resAbi.data.result)
        console.log(basicAbi)
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(currentAccount)
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(marketContractAddress,marketAbi,signer)

        console.log("cancling your nft...")

        const tx = await marketContract.cancelListing(address, tokenId)
        await tx.wait(1)
        console.log("this nft listing is canceld  ", tokenId.toString())

      } else {
        console.log("ethereum object does not exist...")
      }
    } catch (err) {
      console.log(err)
    }
  }


  const buyNFTHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let resAbi = await get(url)
        const basicAbi = JSON.parse(resAbi.data.result)
        console.log(basicAbi)
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(currentAccount)
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(marketContractAddress,marketAbi,signer)
        const basicContract = new ethers.Contract(address,basicAbi,signer)

        console.log("buying your nft...")

        const listing = await marketContract.getListing(address, tokenId)
        const price = listing.price.toString()
        const tx = await marketContract.connect(signer).buyItem(address, tokenId, {
            value: price,
        })
        await tx.wait(1)
        console.log("NFT Bought!")
        const newOwner = await basicContract.ownerOf(tokenId)
        console.log(`New owner of Token ID ${tokenId} is ${newOwner}`) 

      } else {
        console.log("ethereum object does not exist...")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const showNFTHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let resAbi = await get(url)
        const basicAbi = JSON.parse(resAbi.data.result)
        console.log(basicAbi)
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(currentAccount)
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(marketContractAddress,marketAbi,signer)
        const basicContract = new ethers.Contract(address,basicAbi,signer)
        console.log("searching...")

        const listing = await marketContract.getListing(address, tokenId)
        const owner = await basicContract.ownerOf(tokenId)
        const price = listing.price.toString()
        if (listing) {
          console.log(`congrats! this nft is on sale! price: ${price} owner: ${owner}`)
          console.log("details: " ,listing)
        } else {
          console.log("sorry this nft is not for sale...")
        }
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
  
  const cancelNFTButton = () => {
    return (
      <button onClick={cancelNftHandler} className='cta-button cancel-nft-button'>
        cancel NFT List
      </button>
    )
  }

  const buyNFTButton = () => {
    return (
      <button onClick={buyNFTHandler} className='cta-button buy-nft-button'>
        buy NFT
      </button>
    )
  }

  const marketListingButton = () => {
    return (
      <button onClick={showNFTHandler} className='cta-button market-listing-button'>
        show NFT listings on marketplace
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
        <Input onPressEnter={ (value) => inputAddress(value) } type ={ Number } />
        <Input onPressEnter={ (value) => inputTokenId(value) } type ={ Number }/>
        <Input onPressEnter={ (value) => inputPrice(value) } type ={ Number }/>
      </div>
      <h1></h1>
      <div>
        {listNFTButton()}
      </div>
      <h1></h1>
      <div>
        {cancelNFTButton()}
      </div>
      <h1></h1>
      <div>
        {marketListingButton()}
      </div>
      <h1></h1>
      <div>
        {buyNFTButton()}
      </div>
    </div>
  )
}

export default App;