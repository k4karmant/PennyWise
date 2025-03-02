import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial mock data
const initialUserData = {
  name: "Alex",
  goals: [
    {
      id: "1",
      name: "New Earphones",
      target: 2000,
      saved: 1500,
      priority: "High",
      isIndividual: true,
    },
    {
      id: "2",
      name: "Vacation",
      target: 6000,
      saved: 1800,
      priority: "Medium",
      isIndividual: true,
    },
    {
      id: "3",
      name: "New Shirt",
      target: 1800,
      saved: 342,
      priority: "Low",
      isIndividual: true,
    },
    {
      id: "4",
      name: "Group Trip",
      target: 25000,
      saved: 5000,
      priority: "Medium",
      isIndividual: false,
    }
  ]
};

// Initial transactions data - now part of the context
const initialTransactions = [
  { 
    id: '1', 
    type: 'expense', 
    amount: 58.99, 
    category: 'Food & Dining', 
    description: 'Grocery Store', 
    date: '2025-02-28',
    goalName: 'Emergency Fund'
  },
  { 
    id: '2', 
    type: 'income', 
    amount: 25000.00, 
    category: 'Salary', 
    description: 'Monthly Salary', 
    date: '2025-02-25' 
  },
  { 
    id: '3', 
    type: 'expense', 
    amount: 12.50, 
    category: 'Transportation', 
    description: 'Uber Ride', 
    date: '2025-02-24',
    goalName: 'Vacation'
  },
  // ... more initial transactions if needed
];

// Create context
const SavingsContext = createContext();

// Context provider component
export const SavingsProvider = ({ children }) => {
  const [userData, setUserData] = useState(initialUserData);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [totalSaved, setTotalSaved] = useState(0);
  
  // Calculate total saved whenever userData changes
  useEffect(() => {
    const total = userData.goals.reduce((sum, goal) => sum + goal.saved, 0);
    setTotalSaved(total);
  }, [userData]);
  
  // Function to update user data
  const updateUserData = (newData) => {
    setUserData(newData);
  };
  
  // Function to add a transaction to the history
  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  // Values to be provided by the context
  const value = {
    userData,
    updateUserData,
    totalSaved,
    transactions,
    addTransaction
  };
  
  return (
    <SavingsContext.Provider value={value}>
      {children}
    </SavingsContext.Provider>
  );
};

// Custom hook to use the savings context
export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
};