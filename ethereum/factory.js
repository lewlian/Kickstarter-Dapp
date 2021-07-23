import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xB92aF8dadD2ec2d8cb4feACC14d242F6d7A54001'
);

//we use factory.js to get access to the factory contract instance
export default instance;
