import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // Changed from Ionicons to Feather

// Mock data - in a real app, this would come from your backend/state management
const transactionData = [
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
    amount: 1200.00, 
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
  { 
    id: '4', 
    type: 'expense', 
    amount: 35.00, 
    category: 'Entertainment', 
    description: 'Movie Tickets', 
    date: '2025-02-22',
    goalName: 'Entertainment Budget'
  },
  { 
    id: '5', 
    type: 'income', 
    amount: 250.00, 
    category: 'Freelance', 
    description: 'Design Project', 
    date: '2025-02-20' 
  },
  { 
    id: '6', 
    type: 'expense', 
    amount: 120.75, 
    category: 'Shopping', 
    description: 'Clothing Store', 
    date: '2025-02-19',
    goalName: 'New Laptop'
  },
  { 
    id: '7', 
    type: 'income', 
    amount: 45.00, 
    category: 'Refund', 
    description: 'Return Item', 
    date: '2025-02-18' 
  },
  { 
    id: '8', 
    type: 'expense', 
    amount: 9.99, 
    category: 'Subscriptions', 
    description: 'Streaming Service', 
    date: '2025-02-15',
    goalName: 'Entertainment Budget'
  },
  { 
    id: '9', 
    type: 'expense', 
    amount: 85.65, 
    category: 'Utilities', 
    description: 'Electricity Bill', 
    date: '2025-02-10',
    goalName: 'Emergency Fund'
  },
  { 
    id: '10', 
    type: 'income', 
    amount: 30.00, 
    category: 'Gift', 
    description: 'Birthday Gift', 
    date: '2025-02-05' 
  },
];

// Group transactions by date
const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  
  // Convert to array format for FlatList
  return Object.keys(grouped)
    .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
    .map(date => ({
      date,
      data: grouped[date]
    }));
};

const TransactionHistoryPage = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  
  // Filter transactions based on selected filter
  const filteredTransactions = transactionData.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderTransaction = ({ item }) => {
    const isExpense = item.type === 'expense';
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Feather 
            name={isExpense ? 'arrow-down' : 'arrow-up'} 
            size={16} 
            color={isExpense ? 'white' : 'white'}
            style={{ backgroundColor: isExpense ? '#fa5252' : '#40c057', padding: 4, borderRadius: 12 }}
          />
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>
            {item.description}
          </Text>
          <Text style={styles.transactionCategory}>
            {item.category}
            {item.goalName && <Text style={styles.goalName}> • {item.goalName}</Text>}
          </Text>
        </View>
        
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { color: isExpense ? '#fa5252' : '#40c057' }
          ]}>
            {isExpense ? '-' : '+'} ₹{item.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const renderDateGroup = ({ item }) => {
    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
        
        {item.data.map(transaction => (
          <View key={transaction.id}>
            {renderTransaction({ item: transaction })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.activeFilterText
          ]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filter === 'income' && styles.activeFilter,
            filter === 'income' && { backgroundColor: 'rgba(64, 192, 87, 0.1)' }
          ]}
          onPress={() => setFilter('income')}
        >
          <Text style={[
            styles.filterText,
            filter === 'income' && styles.activeFilterText,
            filter === 'income' && { color: '#40c057' }
          ]}>Income</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filter === 'expense' && styles.activeFilter,
            filter === 'expense' && { backgroundColor: 'rgba(250, 82, 82, 0.1)' }
          ]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[
            styles.filterText,
            filter === 'expense' && styles.activeFilterText,
            filter === 'expense' && { color: '#fa5252' }
          ]}>Expenses</Text>
        </TouchableOpacity>
      </View>
      
      {groupedTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="file-text" size={48} color="#adb5bd" />
          <Text style={styles.emptyStateText}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={groupedTransactions}
          renderItem={renderDateGroup}
          keyExtractor={item => item.date}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f3f5',
  },
  activeFilter: {
    backgroundColor: '#e7f5ff',
  },
  filterText: {
    fontSize: 14,
    color: '#495057',
  },
  activeFilterText: {
    fontWeight: '600',
    color: '#4c6ef5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6c757d',
  },
  goalName: {
    fontSize: 14,
    color: '#6c757d',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default TransactionHistoryPage;