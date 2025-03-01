import React, { useState, createContext, useContext } from 'react';

// Mock data - in a real app, this would come from your backend/state management
const initialUserData = {
    name: 'Alex',
    goals: [
      { id: 1, name: 'Vacation', target: 5000, saved: 400, priority: 'High', isIndividual: true },
      { id: 2, name: 'New Earphones', target: 2000, saved: 250, priority: 'Medium', isIndividual: true },
      { id: 3, name: 'Computer Mouse', target: 500, saved: 135, priority: 'Low', isIndividual: true },
    ],
  };
  
  // Create context for the savings data
  const SavingsContext = createContext();
  
  // Create the provider component for the savings context
  export const SavingsProvider = ({ children }) => {
    const [userData, setUserData] = useState(initialUserData);
  
    // Calculate total saved across all goals
    const totalSaved = userData.goals.reduce((sum, goal) => sum + goal.saved, 0);
  
    // Function to update user data
    const updateUserData = (newData) => {
      setUserData(newData);
    };
  
    // Provide the context values
    const value = {
      userData,
      updateUserData,
      totalSaved
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
    if (context === undefined) {
      throw new Error('useSavings must be used within a SavingsProvider');
    }
    return context;
  };