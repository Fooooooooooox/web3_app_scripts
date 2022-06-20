export const connectWalletHandler = async () => {
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