import React from 'react';
import { StatusBar } from 'react-native';
import SimpleTabs from './navigator'; // Ensure the path is correct
import { SavingsProvider } from './SavingsContext'; // Import SavingsContext

const App = () => {
  return (
    <SavingsProvider>
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SimpleTabs />
      </>
    </SavingsProvider>
  );
};

export default App;
