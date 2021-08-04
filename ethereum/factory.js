import CampaignFactory from './build/CampaignFactory.json';
import web3 from './web3';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x099419f2273Beb18200b04B1173DCc87A8CaCdd0'
);

//we use factory.js to get access to the factory contract instance
export default instance;
