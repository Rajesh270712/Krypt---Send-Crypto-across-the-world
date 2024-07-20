  // https://eth-sepolia.g.alchemy.com/v2/FDwDU9ZrQzRWOcnRR4LyrLKe7Jq1GaJs

  require("@nomiclabs/hardhat-waffle");

  module.exports= {
    solidity: '0.8.0',
    networks : {
      sepolia : {
        url: 'https://eth-sepolia.g.alchemy.com/v2/FDwDU9ZrQzRWOcnRR4LyrLKe7Jq1GaJs',
        accounts : ['147329e79c2bb7c8779f75bb557000c1e6d1d7740af17740032afffd52137cf5']
      }
    }
  }