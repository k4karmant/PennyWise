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

// Mock data for the chart
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [180, 100, 250, 275, 136, 256],
      color: (opacity = 1) => `rgba(76, 110, 245, ${opacity})`,
      strokeWidth: 3,
    },
  ],
};

// Mock data for savings history
const savingsHistory = [
  { id: '1', date: '2025-02-28', time: '14:32', transactionAmount: 58, savedAmount: 2, description: 'Veggies' },
  { id: '2', date: '2025-02-25', time: '09:15', transactionAmount: 77, savedAmount: 3, description: 'Milk' },
  { id: '3', date: '2025-02-24', time: '18:45', transactionAmount: 26, savedAmount: 4, description: 'Uber Ride' },
  { id: '4', date: '2025-02-22', time: '20:10', transactionAmount: 35, savedAmount: 0, description: 'Snacks' },
];

const SavingsHistoryPage = () => {
  const screenWidth = Dimensions.get('window').width;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  const renderSavingsItem = ({ item }) => (
    <View style={styles.savingsItem}>
      <View style={styles.savingsInfo}>
        <Text style={styles.savingsDescription}>{item.description}</Text>
        <Text style={styles.dateTime}>{formatDate(item.date)} • {item.time}</Text>
      </View>
      <View style={styles.savingsAmounts}>
        <Text style={styles.transactionAmount}>₹{item.transactionAmount.toFixed(2)}</Text>
        <Text style={styles.savedAmount}>+₹{item.savedAmount.toFixed(2)}</Text>
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
          <FlatList data={savingsHistory} renderItem={renderSavingsItem} keyExtractor={item => item.id} scrollEnabled={false} />
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
});

export default SavingsHistoryPage;
