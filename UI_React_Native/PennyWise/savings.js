import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSavings } from './SavingsContext'; // Import the useSavings hook

const SavingsHistoryPage = () => {
  const { transactions } = useSavings(); // Get transactions from context
  const screenWidth = Dimensions.get('window').width;

  // Filter transactions to only show UPI payments with rounded savings
  const savingsTransactions = transactions.filter(
    transaction => transaction.type === 'expense' && 
                  transaction.category === 'UPI Payment' && 
                  transaction.roundedSavings > 0
  );

  // Prepare data for the chart - group by month and sum savings
  const prepareChartData = () => {
    const monthlyData = {};
    
    // Group transactions by month
    savingsTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      
      monthlyData[month] += transaction.roundedSavings;
    });
    
    // Convert to arrays for the chart
    const months = Object.keys(monthlyData).slice(-6); // Get last 6 months
    const values = months.map(month => monthlyData[month]);
    
    // If we have fewer than 6 months of data, pad with empty months
    while (months.length < 6) {
      months.unshift('');
      values.unshift(0);
    }
    
    return {
      labels: months,
      datasets: [
        {
          data: values.length > 0 ? values : [0, 0, 0, 0, 0, 0], // Default if no data
          color: (opacity = 1) => `rgba(76, 110, 245, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderSavingsItem = ({ item }) => (
    <View style={styles.savingsItem}>
      <View style={styles.savingsInfo}>
        <Text style={styles.savingsDescription}>{item.description}</Text>
        <Text style={styles.dateTime}>{formatDate(item.date)} • {formatTime(item.date)}</Text>
      </View>
      <View style={styles.savingsAmounts}>
        <Text style={styles.transactionAmount}>₹{item.amount.toFixed(2)}</Text>
        <Text style={styles.savedAmount}>+₹{item.roundedSavings.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savings History</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Savings Growth</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 110, 245, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '5', strokeWidth: '2', stroke: '#4c6ef5' },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Savings Transactions</Text>
          {savingsTransactions.length > 0 ? (
            <FlatList 
              data={savingsTransactions} 
              renderItem={renderSavingsItem} 
              keyExtractor={item => item.id} 
              scrollEnabled={false} 
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No UPI transactions with rounded savings yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#212529' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  chartContainer: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#343a40', marginBottom: 12 },
  chart: { borderRadius: 12 },
  historySection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#343a40', marginBottom: 12 },
  savingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginVertical: 6, elevation: 1 },
  savingsInfo: { flex: 1 },
  savingsDescription: { fontSize: 16, fontWeight: '500', color: '#343a40' },
  dateTime: { fontSize: 14, color: '#6c757d' },
  savingsAmounts: { minWidth: 140, alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: '#fa5252' },
  savedAmount: { fontSize: 16, fontWeight: '600', color: '#4c6ef5' },
  emptyState: { backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyStateText: { fontSize: 16, color: '#6c757d', textAlign: 'center' },
});

export default SavingsHistoryPage;