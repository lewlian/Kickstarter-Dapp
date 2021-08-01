import CampaignJSON from "./build/Campaign.json";
import web3 from "./web3";

const Campaign = (address) => {
  return new web3.eth.Contract(JSON.parse(CampaignJSON.interface), address);
};

export default Campaign;
