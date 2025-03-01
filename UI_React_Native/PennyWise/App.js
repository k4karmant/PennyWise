import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import SimpleTabs from './navigator'; // Update the path based on your project structure

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SimpleTabs />
    </>
  );
};

export default App;