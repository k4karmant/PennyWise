import React, { createContext, useContext, useState } from 'react';

// Create Transaction Context
const TransactionsContext = createContext();

// Transactions Provider
export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Function to add a new transaction
  const addTransaction = (transaction) => {
    setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
  };

  // Function to get transactions (optional API call can be added later)
  const getTransactions = () => {
    return transactions;
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, getTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};

// Custom hook to use Transactions Context
export const useTransactions = () => {
  return useContext(TransactionsContext);
};
