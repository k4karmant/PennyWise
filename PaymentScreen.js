import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';

// This is a simulation for Snack
const simulateRazorpay = (options) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Razorpay Simulation",
      `Payment of ₹${options.amount/100} to ${options.name}`,
      [
        {
          text: "Pay",
          onPress: () => resolve({
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substr(2, 9),
            razorpay_order_id: options.order_id,
            razorpay_signature: 'sig_' + Math.random().toString(36).substr(2, 9)
          })
        },
        {
          text: "Cancel",
          onPress: () => reject({description: "Payment cancelled by user"}),
          style: "cancel"
        }
      ]
    );
  });
};

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  const createOrder = async () => {
    if (!validateAmount()) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const orderData = {
          id: 'order_' + Math.random().toString(36).substr(2, 9),
          amount: parseFloat(amount) * 100
        };
        
        setOrderDetails(orderData);
        openRazorpayCheckout(orderData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to create payment order');
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (orderData) => {
    const options = {
      description: 'Payment for your order',
      currency: 'INR',
      key: 'rzp_test_simulation',
      amount: orderData.amount,
      name: 'Your Company Name',
      order_id: orderData.id,
      prefill: {
        email: 'customer@example.com',
        contact: '9876543210',
        name: 'Customer Name'
      },
      theme: { color: '#3399cc' }
    };

    simulateRazorpay(options)
      .then((data) => {
        // Handle success
        verifyPayment(data);
      })
      .catch((error) => {
        // Handle failure
        Alert.alert('Payment Failed', `Error: ${error.description}`);
      });
  };

  const verifyPayment = async (paymentData) => {
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      Alert.alert('Success', 'Payment Successful!');
      setAmount('');
      setOrderDetails(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount (INR)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3399cc" />
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={createOrder}
          disabled={!validateAmount()}
        >
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3399cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;