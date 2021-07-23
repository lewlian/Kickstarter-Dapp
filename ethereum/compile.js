const path = require('path');
const solc = require('solc');
//fs stands for filesystems
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//get path to the campaign.sol
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

//use solidity compiler to compile
const output = solc.compile(source, 1).contracts;

//output contains campaign and campaignFactory
fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
