import { get } from 'axios' 

const address = "0x8737F29dfd8c84D66f7E4d906f8B6D64385fa7F6"

const apiKey = "R4IMSY2FIN2KV3ZV34SXU77SWCM2T7WJ5X"
const url = `https://api.etherscan.io/api
?module=contract
&action=getabi
&address=${address}
&apikey=${apiKey}`

const getAbi = async () => {
    const res = await get(url)
    const abi = JSON.parse(res.data.result)
    console.log(abi)
}

getAbi()