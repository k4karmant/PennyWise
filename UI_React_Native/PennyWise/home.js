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
import { useSavings } from './SavingsContext'; // Import the useSavings hook

// Priority colors
const priorityColors = {
  High: '#e03131',
  Medium: '#f59f00',
  Low: '#40c057',
};

const HomePage = () => {
  const { userData, updateUserData, totalSaved, addTransaction } = useSavings();
  const [manualTransferVisible, setManualTransferVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  
  // Round-off functionality
  const [upiPaymentVisible, setUpiPaymentVisible] = useState(false);
  const [upiAmount, setUpiAmount] = useState('');
  const [wallet, setWallet] = useState(0);
  
  // Track transaction count for display purposes
  const [transactionCount, setTransactionCount] = useState(0);

  // Calculate percentage for progress bars
  const calculatePercentage = (saved, target) => {
    const percentage = (saved / target) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  // Filter goals to only show individual goals
  const individualGoals = userData.goals.filter(goal => goal.isIndividual);

  // Open manual transfer modal
  const openManualTransfer = () => {
    setManualTransferVisible(true);
    setSelectedGoalId(null); // Reset selected goal
  };

  // Open manual transfer modal for a specific goal
  const openGoalTransfer = (goalId) => {
    setSelectedGoalId(goalId);
    setManualTransferVisible(true);
  };

  // Open UPI payment modal
  const openUpiPayment = () => {
    setUpiPaymentVisible(true);
  };

  // Handle UPI payment with round-off savings
  const handleUpiPayment = () => {
    const numAmount = parseFloat(upiAmount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid input", "Please enter a valid amount.");
      return;
    }
    
    // Calculate round-up amount
    let roundUp = 0;
    if (numAmount < 100) {
      roundUp = Math.ceil(numAmount / 5) * 5;
    } else {
      roundUp = Math.ceil(numAmount / 10) * 10;
    }
    
    const difference = roundUp - numAmount;
    
    // Update wallet
    setWallet(wallet + numAmount);
    
    // Update transaction count
    setTransactionCount(transactionCount + 1);
    
    // Distribute the rounded up amount to goals based on priority
    const priorities = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };
    
    // Only consider individual goals for automatic distribution
    const relevantGoals = userData.goals.filter(goal => goal.isIndividual);
    const totalPriorityPoints = relevantGoals.reduce((sum, goal) => sum + priorities[goal.priority], 0);
    
    const updatedGoals = userData.goals.map(goal => {
      // Only distribute to individual goals
      if (goal.isIndividual) {
        const priorityWeight = priorities[goal.priority] / totalPriorityPoints;
        const goalAmount = Math.round(difference * priorityWeight);
        
        return {
          ...goal,
          saved: goal.saved + goalAmount
        };
      }
      return goal;
    });
    
    // Get goal with highest priority for transaction record
    let primaryGoal = relevantGoals.reduce((prev, current) => {
      return priorities[current.priority] > priorities[prev.priority] ? current : prev;
    }, relevantGoals[0]);
    
    // Add transaction to global history
    addTransaction({
      id: Date.now().toString(),
      type: 'expense',
      amount: numAmount,
      category: 'UPI Payment',
      description: 'UPI Transaction',
      date: new Date().toISOString().split('T')[0],
      goalName: difference > 0 ? primaryGoal.name : undefined,
      roundedSavings: difference
    });
    
    // Update userData with new goals
    updateUserData({
      ...userData,
      goals: updatedGoals
    });
    
    Alert.alert(
      "Payment Successful!", 
      `₹${numAmount.toFixed(2)} paid and ₹${difference.toFixed(2)} added to savings!`
    );
    
    // Reset and close modal
    setUpiAmount('');
    setUpiPaymentVisible(false);
  };

  // Handle manual transfer submission
  const handleManualTransfer = () => {
    const amount = parseInt(transferAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    // Update user data
    let updatedGoals;
    let targetGoalName;
    
    if (selectedGoalId) {
      // Add to specific goal
      updatedGoals = userData.goals.map(goal => {
        if (goal.id === selectedGoalId) {
          targetGoalName = goal.name;
          return {
            ...goal,
            saved: goal.saved + amount
          };
        }
        return goal;
      });
      
      Alert.alert('Success', `₹${amount} added to ${userData.goals.find(g => g.id === selectedGoalId).name}!`);
    } else {
      // Add to all individual goals proportionally based on priority
      const priorities = {
        'High': 3,
        'Medium': 2,
        'Low': 1
      };
      
      // Only consider individual goals for automatic distribution
      const relevantGoals = userData.goals.filter(goal => goal.isIndividual);
      const totalPriorityPoints = relevantGoals.reduce((sum, goal) => sum + priorities[goal.priority], 0);
      
      updatedGoals = userData.goals.map(goal => {
        // Only distribute to individual goals
        if (goal.isIndividual) {
          const priorityWeight = priorities[goal.priority] / totalPriorityPoints;
          const goalAmount = Math.round(amount * priorityWeight);
          
          return {
            ...goal,
            saved: goal.saved + goalAmount
          };
        }
        return goal;
      });
      
      // Get highest priority goal for the record
      let primaryGoal = relevantGoals.reduce((prev, current) => {
        return priorities[current.priority] > priorities[prev.priority] ? current : prev;
      }, relevantGoals[0]);
      
      targetGoalName = "Multiple Goals";
      
      Alert.alert('Success', `₹${amount} distributed across your individual goals based on priority!`);
    }

    // Add transaction to global history
    addTransaction({
      id: Date.now().toString(),
      type: 'income',
      amount: amount,
      category: 'Savings Deposit',
      description: 'Manual Transfer',
      date: new Date().toISOString().split('T')[0],
      goalName: targetGoalName
    });

    // Update userData with new goals
    updateUserData({
      ...userData,
      goals: updatedGoals
    });

    // Reset and close the modal
    setTransferAmount('');
    setManualTransferVisible(false);
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

        {/* Total savings card - now includes all savings */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsLabel}>Total Money Saved</Text>
          <Text style={styles.savingsAmount}>₹{totalSaved.toLocaleString()}</Text>
          {transactionCount > 0 && (
            <Text style={styles.savingsSubtext}>
              Including round-ups from {transactionCount} transaction(s)
            </Text>
          )}
        </View>

        {/* Goals with progress bars */}
        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Your Individual Goals</Text>
          
          {individualGoals.map((goal, index) => {
            const percentage = calculatePercentage(goal.saved, goal.target);
            
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.goalItem}
                onPress={() => openGoalTransfer(goal.id)}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalNameContainer}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityColors[goal.priority] }]}>
                      <Text style={styles.priorityText}>{goal.priority}</Text>
                    </View>
                  </View>
                  <Text style={styles.goalAmount}>
                    ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${percentage}%`, backgroundColor: priorityColors[goal.priority] }
                    ]} 
                  />
                </View>
                
                <View style={styles.goalFooter}>
                  <Text style={styles.percentageText}>{Math.round(percentage)}% complete</Text>
                  <Text style={styles.tapToAddText}>Tap to add money</Text>
                </View>
              </TouchableOpacity>
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
              onPress={openUpiPayment}
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
            <Text style={styles.modalTitle}>
              {selectedGoalId 
                ? `Add Money to: ${userData.goals.find(g => g.id === selectedGoalId)?.name}` 
                : 'Add Money to All Individual Goals'}
            </Text>
            
            {selectedGoalId && (
              <Text style={styles.modalSubtitle}>
                Priority: {userData.goals.find(g => g.id === selectedGoalId)?.priority}
              </Text>
            )}
            
            <Text style={styles.modalLabel}>Enter Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              value={transferAmount}
              onChangeText={setTransferAmount}
              placeholder="0"
              keyboardType="number-pad"
              autoFocus={true}
            />
            
            {!selectedGoalId && (
              <Text style={styles.distributionNote}>
                Money will be distributed based on goal priorities
              </Text>
            )}
            
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
      
      {/* UPI Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={upiPaymentVisible}
        onRequestClose={() => setUpiPaymentVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              UPI Payment with Round-Off Savings
            </Text>
            
            <Text style={styles.roundOffExplanation}>
              The amount you pay will be rounded up, and the difference will be added to your savings goals based on their priorities.
            </Text>
            
            <Text style={styles.modalLabel}>Enter Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              value={upiAmount}
              onChangeText={setUpiAmount}
              placeholder="0"
              keyboardType="number-pad"
              autoFocus={true}
            />
            
            <Text style={styles.roundOffPreview}>
              {!isNaN(parseFloat(upiAmount)) && parseFloat(upiAmount) > 0 ? (
                <>
                  You'll pay: ₹{parseFloat(upiAmount).toFixed(2)}
                  {'\n'}
                  Will be rounded to: ₹{
                    parseFloat(upiAmount) < 100 
                      ? Math.ceil(parseFloat(upiAmount) / 5) * 5 
                      : Math.ceil(parseFloat(upiAmount) / 10) * 10
                  }.00
                  {'\n'}
                  Savings: ₹{(
                    parseFloat(upiAmount) < 100 
                      ? Math.ceil(parseFloat(upiAmount) / 5) * 5 - parseFloat(upiAmount)
                      : Math.ceil(parseFloat(upiAmount) / 10) * 10 - parseFloat(upiAmount)
                  ).toFixed(2)}
                </>
              ) : 'Enter an amount to see savings preview'}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setUpiAmount('');
                  setUpiPaymentVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleUpiPayment}
              >
                <Text style={styles.addButtonText}>Pay Now</Text>
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
  savingsSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 8,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageText: {
    fontSize: 14,
    color: '#6c757d',
  },
  tapToAddText: {
    fontSize: 14,
    color: '#4c6ef5',
    fontStyle: 'italic',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  distributionNote: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  roundOffExplanation: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  roundOffPreview: {
    fontSize: 14,
    color: '#495057',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
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