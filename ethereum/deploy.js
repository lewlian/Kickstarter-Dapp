const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

//set up hdwallerprovider
const provider = new HDWalletProvider(
  'fffff',
  'https://rinkeby.infura.io/v3/760d7935886041a7b786651bb3a863ce'
);

const web3 = new Web3(provider);

const deploy = async () => {
  //get list of accounts that has been unlocked by our provider
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  //interace = ABI
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
