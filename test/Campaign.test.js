const assert = require('assert');
//ganache serves as a provider
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //deploy an instance of factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: '1000000' });

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

//start test
describe('Campaigns', () => {
  it('deploys factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it('allows contributers and add them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    //look up a single value in the approval variable and see if true is returned

    const isContributer = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributer);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: '50', from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    // you don't get any return value
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    const request = await campaign.methods.requests(0).call();
    assert.strictEqual('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    //send 5 ether to the vendor/supplier as the manager
    await campaign.methods
      .createRequest(
        'Buy batteries',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    //check that the request complete flag is changed to boolean
    const request = await campaign.methods.requests(0).call();
    assert(request.complete);

    // ganache accounts might have varying balances from every test run
    // check that the supplier/vendor received the ether transfer from finalize request
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
