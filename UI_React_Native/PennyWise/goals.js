import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSavings } from './SavingsContext'; 
import Icon from 'react-native-vector-icons/Feather'; // Changed from Ionicons to Feather

const GoalsPage = () => {
  const { userData, updateUserData, totalSaved } = useSavings();
  const [goalType, setGoalType] = useState('individual');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [manualTransferVisible, setManualTransferVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  // Calculate percentage for progress bars
  const calculatePercentage = (saved, target) => {
    const percentage = (saved / target) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectGoalType = (type) => {
    setGoalType(type);
    setDropdownVisible(false);
  };

  const handleAddGoal = () => {
    // In a real app, this would navigate to the goal creation screen
    console.log('Add new goal');
  };

  // Open manual transfer modal for a specific goal
  const openGoalTransfer = (goalId) => {
    setSelectedGoalId(goalId);
    setManualTransferVisible(true);
  };

  // Handle manual transfer submission
  const handleManualTransfer = () => {
    const amount = parseInt(transferAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    // Find the selected goal
    const selectedGoal = userData.goals.find(goal => goal.id === selectedGoalId);
    
    if (!selectedGoal) {
      Alert.alert('Error', 'Selected goal not found');
      return;
    }

    // Update the specific goal
    const updatedGoals = userData.goals.map(goal => {
      if (goal.id === selectedGoalId) {
        return {
          ...goal,
          saved: goal.saved + amount
        };
      }
      return goal;
    });
    
    // Update the userData context
    updateUserData({
      ...userData,
      goals: updatedGoals
    });
    
    Alert.alert('Success', `₹${amount} added to ${selectedGoal.name}!`);
    
    // Reset and close the modal
    setTransferAmount('');
    setManualTransferVisible(false);
  };

  // Filter goals based on selected type
  const filteredGoals = userData.goals.filter(goal => 
    goalType === 'individual' ? goal.isIndividual : !goal.isIndividual
  );

  const renderGoalItem = ({ item }) => {
    const percentage = calculatePercentage(item.saved, item.target);
    const dueDate = new Date(item.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <TouchableOpacity 
        style={styles.goalCard}
        onPress={() => openGoalTransfer(item.id)}
      >
        <View style={styles.goalCardHeader}>
          <Text style={styles.goalName}>{item.name}</Text>
          <View style={[
            styles.priorityBadge, 
            {
              backgroundColor: 
                item.priority === 'High' ? '#e03131' : 
                item.priority === 'Medium' ? '#f59f00' : '#40c057'
            }
          ]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>

        <View style={styles.goalAmounts}>
          <Text style={styles.savedAmount}>₹{item.saved.toLocaleString()}</Text>
          <Text style={styles.targetAmount}>of ₹{item.target.toLocaleString()}</Text>
        </View>
        
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%` },
              item.priority === 'High' ? { backgroundColor: '#e03131' } :
              item.priority === 'Medium' ? { backgroundColor: '#f59f00' } :
                               { backgroundColor: '#40c057' }
            ]} 
          />
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.percentageText}>{Math.round(percentage)}% complete</Text>
          <Text style={styles.dueDate}>Due: {formattedDate}</Text>
        </View>

        {!item.isIndividual && (
          <View style={styles.membersInfo}>
            <Icon name="users" size={16} color="#6c757d" />
            <Text style={styles.membersText}>{item.members} members</Text>
          </View>
        )}
        
        <Text style={styles.tapToAddText}>Tap to add money</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>

        <View style={styles.totalSavedChip}>
          <Text style={styles.totalSavedText}>
            Total: ₹{totalSaved.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={toggleDropdown}
          >
            <Text style={styles.dropdownButtonText}>
              {goalType === 'individual' ? 'Individual Goals' : 'Collaborative Goals'}
            </Text>
            <Icon 
              name={dropdownVisible ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#343a40" 
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => selectGoalType('individual')}
              >
                <Text style={[
                  styles.dropdownItemText,
                  goalType === 'individual' && styles.activeDropdownItem
                ]}>
                  Individual Goals
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => selectGoalType('collaborative')}
              >
                <Text style={[
                  styles.dropdownItemText,
                  goalType === 'collaborative' && styles.activeDropdownItem
                ]}>
                  Collaborative Goals
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddGoal}
        >
          <Icon name="plus" size={22} color="white" />
          <Text style={styles.addButtonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredGoals}
        renderItem={renderGoalItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
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
              {selectedGoalId && `Add Money to: ${userData.goals.find(g => g.id === selectedGoalId)?.name}`}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalSavedChip: {
    backgroundColor: '#4c6ef5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  totalSavedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 8,
    color: '#343a40',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#495057',
  },
  activeDropdownItem: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c6ef5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
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
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  savedAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  targetAmount: {
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 6,
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    color: '#495057',
  },
  dueDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  membersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  membersText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 6,
  },
  tapToAddText: {
    fontSize: 14,
    color: '#4c6ef5',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
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

export default GoalsPage;