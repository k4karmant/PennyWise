import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSavings } from './SavingsContext';

const AddGoalModal = ({ visible, onClose }) => {
  const { userData, updateUserData } = useSavings();
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isIndividual, setIsIndividual] = useState(true);
  const [members, setMembers] = useState('1');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default: 30 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false);
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false);

  const resetForm = () => {
    setGoalName('');
    setTargetAmount('');
    setPriority('Medium');
    setIsIndividual(true);
    setMembers('1');
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    // Validation
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }

    const amount = parseInt(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount greater than 0');
      return;
    }

    if (!isIndividual && (parseInt(members) <= 1 || isNaN(parseInt(members)))) {
      Alert.alert('Error', 'Please enter at least 2 members for collaborative goals');
      return;
    }

    // Create new goal object
    const newGoal = {
      id: Date.now(), // Using timestamp as a simple ID
      name: goalName.trim(),
      target: amount,
      saved: 0,
      priority,
      isIndividual,
      members: isIndividual ? 1 : parseInt(members),
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString()
    };

    // Update userData with the new goal
    const updatedGoals = [...userData.goals, newGoal];
    updateUserData({
      ...userData,
      goals: updatedGoals
    });

    // Show success message
    Alert.alert('Success', `Goal "${goalName}" has been created!`);
    
    // Reset form and close modal
    resetForm();
    onClose();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const togglePriorityDropdown = () => {
    setPriorityDropdownVisible(!priorityDropdownVisible);
    if (typeDropdownVisible) setTypeDropdownVisible(false);
  };

  const toggleTypeDropdown = () => {
    setTypeDropdownVisible(!typeDropdownVisible);
    if (priorityDropdownVisible) setPriorityDropdownVisible(false);
  };

  const selectPriority = (selected) => {
    setPriority(selected);
    setPriorityDropdownVisible(false);
  };

  const selectType = (isIndiv) => {
    setIsIndividual(isIndiv);
    if (!isIndiv) {
      setMembers('2');
    } else {
      setMembers('1');
    }
    setTypeDropdownVisible(false);
  };

  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Icon name="x" size={24} color="#495057" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.textInput}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="Enter goal name"
              maxLength={30}
            />

            <Text style={styles.inputLabel}>Target Amount (₹)</Text>
            <TextInput
              style={styles.textInput}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="0"
              keyboardType="number-pad"
            />

            <Text style={styles.inputLabel}>Goal Type</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={toggleTypeDropdown}
              >
                <Text style={styles.dropdownButtonText}>
                  {isIndividual ? 'Individual Goal' : 'Collaborative Goal'}
                </Text>
                <Icon
                  name={typeDropdownVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#343a40"
                />
              </TouchableOpacity>

              {typeDropdownVisible && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectType(true)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      isIndividual && styles.activeDropdownItem
                    ]}>
                      Individual Goal
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectType(false)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      !isIndividual && styles.activeDropdownItem
                    ]}>
                      Collaborative Goal
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {!isIndividual && (
              <>
                <Text style={styles.inputLabel}>Number of Members</Text>
                <TextInput
                  style={styles.textInput}
                  value={members}
                  onChangeText={setMembers}
                  placeholder="2"
                  keyboardType="number-pad"
                />
              </>
            )}

            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={togglePriorityDropdown}
              >
                <View style={styles.priorityButtonContent}>
                  <View style={[
                    styles.priorityDot,
                    {
                      backgroundColor:
                        priority === 'High' ? '#e03131' :
                        priority === 'Medium' ? '#f59f00' : '#40c057'
                    }
                  ]} />
                  <Text style={styles.dropdownButtonText}>{priority}</Text>
                </View>
                <Icon
                  name={priorityDropdownVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#343a40"
                />
              </TouchableOpacity>

              {priorityDropdownVisible && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectPriority('High')}
                  >
                    <View style={styles.priorityItem}>
                      <View style={[styles.priorityDot, { backgroundColor: '#e03131' }]} />
                      <Text style={[
                        styles.dropdownItemText,
                        priority === 'High' && styles.activeDropdownItem
                      ]}>
                        High
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectPriority('Medium')}
                  >
                    <View style={styles.priorityItem}>
                      <View style={[styles.priorityDot, { backgroundColor: '#f59f00' }]} />
                      <Text style={[
                        styles.dropdownItemText,
                        priority === 'Medium' && styles.activeDropdownItem
                      ]}>
                        Medium
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectPriority('Low')}
                  >
                    <View style={styles.priorityItem}>
                      <View style={[styles.priorityDot, { backgroundColor: '#40c057' }]} />
                      <Text style={[
                        styles.dropdownItemText,
                        priority === 'Low' && styles.activeDropdownItem
                      ]}>
                        Low
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>{formattedDate}</Text>
              <Icon name="calendar" size={18} color="#343a40" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Now let's update the GoalsPage component to use our new AddGoalModal
const GoalsPage = () => {
  const { userData, updateUserData, totalSaved } = useSavings();
  const [goalType, setGoalType] = useState('individual');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [manualTransferVisible, setManualTransferVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [addGoalModalVisible, setAddGoalModalVisible] = useState(false);

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
    setAddGoalModalVisible(true);
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
      
      {/* Add Goal Modal */}
      <AddGoalModal 
        visible={addGoalModalVisible}
        onClose={() => setAddGoalModalVisible(false)}
      />
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
    zIndex: 2,
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
  // Modal styles for manual transfer
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
  // Add Goal Modal specific styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#4c6ef5',
    width: '48%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#343a40',
  },
  priorityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GoalsPage;