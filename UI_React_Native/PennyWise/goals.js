import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Changed from Ionicons to Feather

// Mock data - in a real app, this would come from your backend/state management
const userData = {
  totalSaved: 785,
  individualGoals: [
    { id: '1', name: 'Vacation', target: 5000, saved: 785, dueDate: '2025-07-15' },
    { id: '2', name: 'New Earphones', target: 2000, saved: 785, dueDate: '2025-05-20' },
    { id: '3', name: 'Computer Mouse', target: 500, saved: 785, dueDate: '2025-12-31' },
    { id: '4', name: 'New Watch', target: 4000, saved: 785, dueDate: '2025-04-10' },
  ],
  collaborativeGoals: [
    { id: '5', name: 'Trip with Friends', target: 8000, saved: 420, dueDate: '2025-08-30', members: 4 },
    { id: '6', name: 'Group Gift', target: 1500, saved: 255, dueDate: '2025-03-15', members: 5 },
  ],
};

const GoalsPage = () => {
  const [goalType, setGoalType] = useState('individual');
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  const renderGoalItem = ({ item }) => {
    const percentage = calculatePercentage(item.saved, item.target);
    const dueDate = new Date(item.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <View style={styles.goalCard}>
        <View style={styles.goalCardHeader}>
          <Text style={styles.goalName}>{item.name}</Text>
          <TouchableOpacity>
            <Icon name="more-vertical" size={18} color="#6c757d" />
          </TouchableOpacity>
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
              percentage < 30 ? { backgroundColor: '#fa5252' } :
              percentage < 70 ? { backgroundColor: '#fd7e14' } :
                               { backgroundColor: '#40c057' }
            ]} 
          />
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.percentageText}>{Math.round(percentage)}% complete</Text>
          <Text style={styles.dueDate}>Due: {formattedDate}</Text>
        </View>

        {goalType === 'collaborative' && (
          <View style={styles.membersInfo}>
            <Icon name="users" size={16} color="#6c757d" />
            <Text style={styles.membersText}>{item.members} members</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>

        <View style={styles.totalSavedChip}>
          <Text style={styles.totalSavedText}>
            Total: ${userData.totalSaved.toLocaleString()}
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
        data={goalType === 'individual' ? userData.individualGoals : userData.collaborativeGoals}
        renderItem={renderGoalItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
});

export default GoalsPage;