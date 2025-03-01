import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Feather';

const ProfilePage = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  
  const user = {
    name: "Alex Johnson",
    upiId: "alex@ybl",
    email: "alex@example.com",
    phone: "+91 9876543210",
    profilePic: "https://via.placeholder.com/80"
  };
  
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', `${text} copied to clipboard`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: user.profilePic }} 
            style={styles.profilePic}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="#4285F4" />
          </TouchableOpacity>
        </View>
        
        {/* Main Options */}
        <View style={styles.optionsContainer}>
          {/* UPI QR Code Button */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => setShowQRCode(!showQRCode)}
          >
            <View style={styles.optionRow}>
              <View style={styles.optionLabelContainer}>
                <Icon name="qr-code" size={24} color="#4285F4" style={styles.optionIcon} />
                <Text style={styles.optionLabel}>Your UPI QR Code</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#9E9E9E" />
            </View>
            
            {/* QR Code Expanded View */}
            {showQRCode && (
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCodeImageContainer}>
                  <Image 
                    source={{ uri: 'UI_React_Native/PennyWise/orderbook.png' }} 
                    style={styles.qrCodeImage}
                  />
                </View>
                
                <View style={styles.upiIdContainer}>
                  <Text style={styles.upiIdLabel}>UPI ID:</Text>
                  <View style={styles.upiIdValueContainer}>
                    <Text style={styles.upiIdValue}>{user.upiId}</Text>
                    <TouchableOpacity 
                      onPress={() => copyToClipboard(user.upiId)}
                      style={styles.copyButton}
                    >
                      <Icon name="copy" size={16} color="#4285F4" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          {/* UPI Settings */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={styles.optionLabelContainer}>
                <Icon name="settings" size={24} color="#4285F4" style={styles.optionIcon} />
                <Text style={styles.optionLabel}>UPI Settings</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
          
          {/* General Settings */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={styles.optionLabelContainer}>
                <Icon name="settings" size={24} color="#4285F4" style={styles.optionIcon} />
                <Text style={styles.optionLabel}>Settings</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
          
          {/* Help & Support */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <View style={styles.optionLabelContainer}>
                <Icon name="help-circle" size={24} color="#4285F4" style={styles.optionIcon} />
                <Text style={styles.optionLabel}>Help & Support</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4285F4',
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  profilePic: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profilePhone: {
    color: '#757575',
  },
  editButton: {
    padding: 8,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  qrCodeContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  qrCodeImageContainer: {
    padding: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
  upiIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  upiIdLabel: {
    fontSize: 14,
    color: '#757575',
  },
  upiIdValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiIdValue: {
    fontWeight: '500',
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
});

export default ProfilePage;