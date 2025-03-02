import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert } from "react-native";

export default function App() {
  const [amount, setAmount] = useState("");
  const [savings, setSavings] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [savingsHistory, setSavingsHistory] = useState([]);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid input", "Please enter a valid amount.");
      return;
    }
    let roundUp = 0;
    if (numAmount < 100) {
      roundUp = Math.ceil(numAmount / 5) * 5;
    } else {
      roundUp = Math.ceil(numAmount / 10) * 10;
    }
    const difference = roundUp - numAmount;
    setSavings(savings + difference);
    setWallet(wallet + numAmount);
    setTransactionHistory([...transactionHistory, { paid: numAmount, saved: difference }]);
    setSavingsHistory([...savingsHistory, difference]);
    Alert.alert("Payment Successful!", `₹${numAmount.toFixed(2)} paid and ₹${difference.toFixed(2)} added to savings!`);
    setAmount("");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#f0f4f8" }}>
      <Text style={{ fontSize: 28, marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>Savings App</Text>
      <TextInput
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8, borderColor: "#007AFF", backgroundColor: "#fff" }}
      />
      <Button title="Pay and Save" onPress={handleSave} color="#007AFF" />
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <Text style={{ fontSize: 18, marginBottom: 5 }}>Virtual Wallet: ₹{wallet.toFixed(2)}</Text>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Total Savings: ₹{savings.toFixed(2)}</Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 }}>
          <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>Transaction History</Text>
          {transactionHistory.map((t, index) => (
            <Text key={index}>Paid: ₹{t.paid.toFixed(2)}, Saved: ₹{t.saved.toFixed(2)}</Text>
          ))}
        </View>
        <View style={{ backgroundColor: "#fff", borderRadius: 8, padding: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 }}>
          <Text style={{ fontSize: 20, marginVertical: 10, fontWeight: "bold" }}>Savings History</Text>
          {savingsHistory.map((s, index) => (
            <Text key={index}>Saved: ₹{s.toFixed(2)}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
