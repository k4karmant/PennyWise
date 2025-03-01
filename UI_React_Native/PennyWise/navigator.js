import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Import your page components
import HomePage from './home';
import GoalsPage from './goals';
import TransactionHistoryPage from './transactions';
import SavingsHistoryPage from './savings';
import ProfilePage from './profile';

const SimpleTabs = () => {
  const [activeTab, setActiveTab] = useState('Home');

  // Render the active screen based on tab selection
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        
        return <HomePage />;
      case 'Goals':
        return <GoalsPage />;
      case 'Transactions':
        return <TransactionHistoryPage />;
      case 'Savings':
        return <SavingsHistoryPage />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        {['Home', 'Goals', 'Transactions', 'Savings', 'Profile'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={styles.tab} 
            onPress={() => setActiveTab(tab)}
          >
            <Icon 
              name={tab === 'Home' ? 'home' : tab === 'Goals' ? 'target' : tab === 'Transactions' ? 'list' : tab === 'Savings' ? 'dollar-sign' : 'user'} 
              size={24} 
              color={activeTab === tab ? '#4285F4' : '#757575'} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === tab ? '#4285F4' : '#757575' }
            ]}>
              {tab === 'Transactions' ? 'Trans.' : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SimpleTabs;