import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSavings } from './SavingsContext';

const GoalAnalysisModal = ({ visible, onClose, goalId }) => {
  const { userData } = useSavings();
  const [goalDeadline, setGoalDeadline] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the selected goal
  const selectedGoal = userData.goals.find(goal => goal.id === goalId);
  
  // Calculate the remaining amount - moved outside conditional rendering
  const remainingAmount = selectedGoal ? selectedGoal.target - selectedGoal.saved : 0;
  
  // Fetch user transactions when modal opens
  useEffect(() => {
    if (visible && goalId) {
      fetchUserTransactions();
    }
    // Reset states when modal closes
    if (!visible) {
      setGoalDeadline('');
      setRecommendation(null);
    }
  }, [visible, goalId]);
  
  // Function to fetch user's actual transaction history
  const fetchUserTransactions = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first
      let userTransactions;
      try {
        const response = await fetch('your-api-endpoint/transactions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        userTransactions = await response.json();
      } catch (networkError) {
        console.warn('API request failed, using mock data instead:', networkError);
        // Fallback to mock data when API fails
        userTransactions = [
          { id: 1, date: '2025-02-20', amount: 500, category: 'Food' },
          { id: 2, date: '2025-02-18', amount: 1200, category: 'Shopping' },
          { id: 3, date: '2025-02-15', amount: 300, category: 'Entertainment' },
          { id: 4, date: '2025-02-10', amount: 800, category: 'Transportation' },
          { id: 5, date: '2025-02-05', amount: 1500, category: 'Bills' }
        ];
      }
      
      setTransactions(userTransactions);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transaction history.');
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRecommendation = () => {
    if (!goalDeadline) {
      Alert.alert('Error', 'Please enter a goal deadline.');
      return;
    }

    if (transactions.length === 0) {
      Alert.alert('Error', 'No transaction history available for analysis.');
      return;
    }

    const parsedDeadline = new Date(goalDeadline);
    const today = new Date();
    
    if (isNaN(parsedDeadline.getTime()) || parsedDeadline <= today) {
      Alert.alert('Error', 'Please enter a valid future date.');
      return;
    }

    const daysLeft = Math.max(1, Math.ceil((parsedDeadline - today) / (1000 * 60 * 60 * 24)));

    // Sort transactions by date (most recent first)
    const sortedTransactions = transactions
      .map(t => ({ ...t, date: new Date(t.date) }))
      .sort((a, b) => b.date - a.date);

    // Weighted Moving Average for Spending Prediction
    let totalWeight = 0;
    let weightedSum = 0;
    let weight = 1;
    
    for (let i = 0; i < sortedTransactions.length; i++) {
      weightedSum += sortedTransactions[i].amount * weight;
      totalWeight += weight;
      weight *= 0.9; // Reduce weight for older transactions
    }

    const predictedSpending = totalWeight ? (weightedSum / totalWeight) : 0;

    // Daily Savings Calculation
    const dailyMicroSavings = (remainingAmount / daysLeft).toFixed(2);
    
    // Dynamic Expense Cut Calculation
    const cutExpenseSuggestion = Math.min(remainingAmount * 0.1, predictedSpending * 0.2).toFixed(2);
    
    // Weekly Savings Calculation
    const weeklySavings = (dailyMicroSavings * 7).toFixed(2);
    
    // Monthly Savings Calculation
    const monthlySavings = (dailyMicroSavings * 30).toFixed(2);

    // Calculate completion percentage with current savings rate
    const currentSavingsRate = parseFloat(cutExpenseSuggestion) * 30; // Monthly savings
    const monthsToComplete = remainingAmount / currentSavingsRate;
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsToComplete));
    
    setRecommendation({
      predictedSpending: predictedSpending.toFixed(2),
      savingsRecommendations: {
        dailyMicroSavings,
        weeklySavings,
        monthlySavings,
        cutExpenseSuggestion,
      },
      projectedCompletion: {
        months: Math.ceil(monthsToComplete),
        date: completionDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })
      },
      userDeadline: parsedDeadline.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      }),
      willMeetDeadline: completionDate <= parsedDeadline
    });
  };

  // If no goal is selected or visible is false, return empty modal
  if (!selectedGoal || !visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Goal Analysis</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#495057" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.goalInfoContainer}>
              <Text style={styles.goalName}>{selectedGoal.name}</Text>
              
              <View style={styles.amountRow}>
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Target</Text>
                  <Text style={styles.amountValue}>₹{selectedGoal.target.toLocaleString()}</Text>
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Saved</Text>
                  <Text style={styles.amountValue}>₹{selectedGoal.saved.toLocaleString()}</Text>
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Remaining</Text>
                  <Text style={[styles.amountValue, styles.highlightedAmount]}>
                    ₹{remainingAmount.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>When would you like to reach this goal?</Text>
                <TextInput
                  placeholder="Enter deadline (YYYY-MM-DD)"
                  value={goalDeadline}
                  onChangeText={setGoalDeadline}
                  style={styles.input}
                />
                <TouchableOpacity 
                  style={[
                    styles.calculateButton,
                    isLoading && styles.disabledButton
                  ]} 
                  onPress={calculateRecommendation}
                  disabled={isLoading}
                >
                  <Text style={styles.calculateButtonText}>
                    {isLoading ? "Loading Transactions..." : "Calculate Plan"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading your transaction history...</Text>
                </View>
              )}

              {transactions.length === 0 && !isLoading && (
                <View style={styles.noDataContainer}>
                  <Icon name="alert-circle" size={24} color="#fa5252" />
                  <Text style={styles.noDataText}>
                    No transaction history found. We need your transaction data to provide accurate recommendations.
                  </Text>
                </View>
              )}

              {recommendation && (
                <View style={styles.recommendationContainer}>
                  <View style={styles.recommendationHeader}>
                    <Icon 
                      name={recommendation.willMeetDeadline ? "check-circle" : "alert-circle"} 
                      size={24} 
                      color={recommendation.willMeetDeadline ? "#40c057" : "#fa5252"} 
                    />
                    <Text style={styles.recommendationTitle}>
                      {recommendation.willMeetDeadline 
                        ? "You're on track to meet your goal!" 
                        : "You may need to adjust your savings to meet your goal"}
                    </Text>
                  </View>
                  
                  <Text style={styles.deadlineText}>
                    Your target date: {recommendation.userDeadline}
                  </Text>
                  
                  <Text style={styles.deadlineText}>
                    At your current rate: {recommendation.projectedCompletion.date} 
                    ({recommendation.projectedCompletion.months} months)
                  </Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.recommendationSubtitle}>Recommended Savings Plan</Text>
                  
                  <View style={styles.savingOptionContainer}>
                    <View style={styles.savingOption}>
                      <Icon name="calendar" size={18} color="#4c6ef5" />
                      <Text style={styles.savingOptionTitle}>Daily</Text>
                      <Text style={styles.savingOptionValue}>
                        ₹{recommendation.savingsRecommendations.dailyMicroSavings}
                      </Text>
                    </View>
                    
                    <View style={styles.savingOption}>
                      <Icon name="calendar" size={18} color="#4c6ef5" />
                      <Text style={styles.savingOptionTitle}>Weekly</Text>
                      <Text style={styles.savingOptionValue}>
                        ₹{recommendation.savingsRecommendations.weeklySavings}
                      </Text>
                    </View>
                    
                    <View style={styles.savingOption}>
                      <Icon name="calendar" size={18} color="#4c6ef5" />
                      <Text style={styles.savingOptionTitle}>Monthly</Text>
                      <Text style={styles.savingOptionValue}>
                        ₹{recommendation.savingsRecommendations.monthlySavings}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.recommendationSubtitle}>Spending Analysis</Text>
                  
                  <View style={styles.spendingAnalysis}>
                    <Text style={styles.spendingText}>
                      <Text style={styles.spendingLabel}>Predicted Monthly Spending:</Text> 
                      ₹{recommendation.predictedSpending}
                    </Text>
                    
                    <Text style={styles.spendingText}>
                      <Text style={styles.spendingLabel}>Suggested Expense Cut:</Text> 
                      ₹{recommendation.savingsRecommendations.cutExpenseSuggestion}
                    </Text>
                  </View>
                  
                  <View style={styles.tipContainer}>
                    <Icon name="info" size={18} color="#4c6ef5" />
                    <Text style={styles.tipText}>
                      Reducing your spending by ₹{recommendation.savingsRecommendations.cutExpenseSuggestion} monthly
                      could help you reach your goal {recommendation.willMeetDeadline ? "even faster" : "on time"}.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Update handleAnalyse in GoalsPage component
const handleAnalyse = (goalId) => {
  // Update this in the GoalsPage component
  setAnalysisGoalId(goalId);
  setAnalysisModalVisible(true);
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
  },
  scrollContainer: {
    maxHeight: '80%',
  },
  goalInfoContainer: {
    marginBottom: 16,
  },
  goalName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  highlightedAmount: {
    color: '#4c6ef5',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  calculateButton: {
    backgroundColor: '#4c6ef5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#495057',
  },
  noDataContainer: {
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe3e3',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  recommendationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 8,
    flex: 1,
  },
  deadlineText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 16,
  },
  recommendationSubtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
  },
  savingOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  savingOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  savingOptionTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    marginBottom: 4,
  },
  savingOptionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c6ef5',
  },
  spendingAnalysis: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
  },
  spendingText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 8,
  },
  spendingLabel: {
    fontWeight: '500',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#e7f5ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4c6ef5',
  },
  tipText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GoalAnalysisModal;