import { useLoaderData  } from "@remix-run/react";
import stringify from "json-stringify-safe"
import JSONPretty from "react-json-pretty"
import { web3 } from "../entry.server";

var abi = [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "AlreadyListed",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NoProceeds",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotApprovedForMarketplace",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "NotListed",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotOwner",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "PriceMustBeAboveZero",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
          }
      ],
      "name": "PriceNotMet",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
          }
      ],
      "name": "ItemBought",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "seller",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "ItemCanceled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "seller",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
          }
      ],
      "name": "ItemListed",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "buyItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "cancelListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "getListing",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint256",
                      "name": "price",
                      "type": "uint256"
                  },
                  {
                      "internalType": "address",
                      "name": "seller",
                      "type": "address"
                  }
              ],
              "internalType": "struct NftMarketplace.Listing",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "seller",
              "type": "address"
          }
      ],
      "name": "getProceeds",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
          }
      ],
      "name": "listItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "newPrice",
              "type": "uint256"
          }
      ],
      "name": "updateListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawProceeds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
]

export const loader = async () =>
  new Promise((resolve) => {
    web3.eth.getNodeInfo(function (error, result) {
      console.log('Node =', result);
      resolve(result);
    });


  });

export default function Index() {
  const result = useLoaderData();
  return <JSONPretty data={result} />;
}