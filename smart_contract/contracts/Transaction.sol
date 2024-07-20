// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Transaction{
  uint256 transactionCount;
  
  event Transfer(address from, address receiver, string message, uint amount, uint256 timestamp, string keyword);

  struct TransferStruct {
    address sender;
    address receiver;
    string message;
    uint amount;
    uint256 timestamp;
    string keyword;
  }

  TransferStruct[] transactions;

  function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
    transactionCount += 1;
    transactions.push(TransferStruct(msg.sender, receiver, message, amount, block.timestamp, keyword));

    emit Transfer(msg.sender, receiver, message, amount, block.timestamp, keyword);
  }

  function getAllTransaction()public view returns(TransferStruct[] memory){
    return transactions;
  }

  function getAllTransactionCount() public view returns (uint256) {
    return transactionCount;
  }

}