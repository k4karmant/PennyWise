import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const SavingsRecommendation = () => {
  const [goalAmount, setGoalAmount] = useState(500); // Pre-set goal
  const [goalDeadline, setGoalDeadline] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const transactions = [
    { date: "2023-01-01", amount: 58.99 },
    { date: "2023-01-15", amount: 12.90 },
    { date: "2023-02-01", amount: 35 },
    { date: "2023-02-15", amount: 2500 },
    { date: "2023-02-15", amount: 250 },
    { date: "2023-02-15", amount: 120.75 },
    { date: "2023-02-15", amount: 9.99 },
    { date: "2023-02-15", amount: 85.65 },
    { date: "2023-02-15", amount: 30 },
  ];

  const calculateRecommendation = () => {
    if (!goalDeadline) {
      Alert.alert('Error', 'Please enter a goal deadline.');
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

    // **✅ Corrected Daily Savings Calculation**
    const dailyMicroSavings = (goalAmount / daysLeft).toFixed(2);
    
    // **✅ Dynamic Expense Cut Calculation**
    const cutExpenseSuggestion = Math.min(goalAmount * 0.1, predictedSpending * 0.2).toFixed(2);

    setRecommendation({
      predictedSpending: predictedSpending.toFixed(2),
      savingsRecommendations: {
        dailyMicroSavings,
        cutExpenseSuggestion,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Recommendation</Text>
      <Text style={styles.label}>Goal Amount: ₹{goalAmount}</Text>
      <TextInput
        placeholder="Enter deadline (YYYY-MM-DD)"
        value={goalDeadline}
        onChangeText={setGoalDeadline}
        style={styles.input}
      />
      <Button title="Calculate Savings" onPress={calculateRecommendation} />

      {recommendation && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Predicted Spending Next Month: ₹{recommendation.predictedSpending}</Text>
          <Text style={styles.resultText}>Daily Micro Savings: ₹{recommendation.savingsRecommendations.dailyMicroSavings}</Text>
          <Text style={styles.resultText}>Suggested Expense Cut: ₹{recommendation.savingsRecommendations.cutExpenseSuggestion}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d1e7dd',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#155724',
  },
});

export default SavingsRecommendation;
