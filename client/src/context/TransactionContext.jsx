import { ethers } from "ethers";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { contractAbi, contractAddress } from "../utils/constant";
import moment from 'moment-timezone';

export const TransactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract =async () => {

  const provider = new ethers.BrowserProvider(ethereum)
  const signer = await provider.getSigner();
  const TransactionContract = new ethers.Contract(contractAddress, contractAbi, signer);

  console.log("TransactionContract", TransactionContract);

  return TransactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [formData, setFormData] = useState({addressTo : '', amount:'',keyword:'', message: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))
const [transactions, setTransactions] = useState([]);
  const handleChange = (e, name)=>{
    setFormData((prev)=>({...prev, [name]: e.target.value}));
  }

  const checkIfAccountsConnected = async () => {
    try {
      if (!ethereum) alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
    }

  };

  const connectWallet = async () => {
    try {
      if (!ethereum) alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      throw new Error("No Eth account!");
    }
  };

  const sendTransaction = async() =>{
    try {
      if (!ethereum) alert("Please install metamask");

      const {addressTo, amount ,keyword , message} = formData;
  
      const transactionContract = await getEthereumContract();
      const parsedAmount = await ethers.parseEther(amount);
      await ethereum.request({
        method : "eth_sendTransaction",
        params : [{
          from: currentAccount,
          to : addressTo,
          gas: "0x5208",
          value: parsedAmount.toString(16) 
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword);

      setIsLoading(true);
      console.log("loading",transactionHash.hash);

      await transactionHash.wait();

      setIsLoading(false);
      console.log("success",transactionHash.hash);

      const transactionCount = await transactionContract.getAllTransactionCount()
      setTransactionCount(transactionCount)

    } catch (error) {
      throw new Error()
    }
  }

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionContract = await getEthereumContract();
        const availableTransactions = await transactionContract.getAllTransaction();
        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: moment(Number(transaction.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: ethers.formatUnits(transaction.amount, "ether")
        }));

        console.log("structuredTransactions",structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfAccountsConnected();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions }} >
      {children}
    </TransactionContext.Provider>
  );
};
