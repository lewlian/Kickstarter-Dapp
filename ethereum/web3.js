import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  //We are in the browser and metamask is running
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  //we are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/760d7935886041a7b786651bb3a863ce'
  );
  web3 = new Web3(provider);
}

export default web3;
