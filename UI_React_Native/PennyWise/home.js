import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Mock data - in a real app, this would come from your backend/state management
const initialUserData = {
  name: 'Alex',
  totalSaved: 785,
  goals: [
    { name: 'Vacation', target: 5000, saved: 785 },
    { name: 'New Earphones', target: 2000, saved: 785 },
    { name: 'Computer Mouse', target: 500, saved: 785 },
  ],
};

const HomePage = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [manualTransferVisible, setManualTransferVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  // Calculate percentage for progress bars
  const calculatePercentage = (saved, target) => {
    const percentage = (saved / target) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  // Open manual transfer modal
  const openManualTransfer = () => {
    setManualTransferVisible(true);
  };

  // Handle manual transfer submission
  const handleManualTransfer = () => {
    const amount = parseInt(transferAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    // Update user data
    const updatedGoals = userData.goals.map(goal => ({
      ...goal,
      saved: goal.saved + amount
    }));

    setUserData({
      ...userData,
      totalSaved: userData.totalSaved + amount,
      goals: updatedGoals
    });

    // Reset and close the modal
    setTransferAmount('');
    setManualTransferVisible(false);
    
    Alert.alert('Success', `₹${amount} added to your savings!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userData.name}</Text>
            <Text style={styles.subGreeting}>Welcome back!</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
          </View>
        </View>

        {/* Total savings card */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsLabel}>Total Money Saved</Text>
          <Text style={styles.savingsAmount}>₹{userData.totalSaved.toLocaleString()}</Text>
        </View>

        {/* Top 3 goals with progress bars */}
        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Your Top Goals</Text>
          
          {userData.goals.map((goal, index) => {
            const percentage = calculatePercentage(goal.saved, goal.target);
            
            return (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalAmount}>
                  ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${percentage}%` },
                      index === 0 ? { backgroundColor: '#4c6ef5' } :
                      index === 1 ? { backgroundColor: '#40c057' } :
                                    { backgroundColor: '#fd7e14' }
                    ]} 
                  />
                </View>
                
                <Text style={styles.percentageText}>{Math.round(percentage)}% complete</Text>
              </View>
            );
          })}
        </View>

        {/* Payment methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Add Money</Text>
          
          <View style={styles.paymentGrid}>
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={() => console.log('QR scan clicked')}
            >
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>QR</Text>
              </View>
              <Text style={styles.paymentText}>Scan QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={() => console.log('Contact payment clicked')}
            >
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>👤</Text>
              </View>
              <Text style={styles.paymentText}>Pay to Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={() => console.log('UPI payment clicked')}
            >
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>UPI</Text>
              </View>
              <Text style={styles.paymentText}>Pay to UPI</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={openManualTransfer}
            >
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>₹</Text>
              </View>
              <Text style={styles.paymentText}>Manual Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Manual Transfer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manualTransferVisible}
        onRequestClose={() => setManualTransferVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money</Text>
            
            <Text style={styles.modalLabel}>Enter Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              value={transferAmount}
              onChangeText={setTransferAmount}
              placeholder="0"
              keyboardType="number-pad"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setTransferAmount('');
                  setManualTransferVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleManualTransfer}
              >
                <Text style={styles.addButtonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e7f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c6ef5',
  },
  savingsCard: {
    backgroundColor: '#4c6ef5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  savingsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  savingsAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  goalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
  },
  goalAmount: {
    fontSize: 16,
    color: '#495057',
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'right',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  paymentText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#495057',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  amountInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    width: '48%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4c6ef5',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomePage;