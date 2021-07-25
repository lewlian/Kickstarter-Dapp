import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xAf560D9F65197B3d956AcE71a75D79038c25dE52'
);

//we use factory.js to get access to the factory contract instance
export default instance;
