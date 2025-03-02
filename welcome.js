import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleGoogleLogin = () => {
    console.log("Google Login Clicked"); // Replace with Firebase Auth logic
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F67FF" />
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4F67FF', '#3b82f6']} style={styles.gradientBackground}>
          
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image source={require('./assets/logo.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.appName}>PennyWise</Text>
            <Text style={styles.tagline}>Your path to financial freedom</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎯</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Set Financial Goals</Text>
                <Text style={styles.featureDescription}>Track savings visually with progress indicators.</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📊</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Your Progress</Text>
                <Text style={styles.featureDescription}>Monitor savings with real-time updates.</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Easy Payments</Text>
                <Text style={styles.featureDescription}>Supports UPI, QR code & direct transfers.</Text>
              </View>
            </View>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>


            {/* Google Login Button with Logo */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <Image source={require('/assets/logo.png')} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1, justifyContent: 'space-between', padding: 20 },
  
  logoContainer: { alignItems: 'center', marginTop: height * 0.08 },
  logoCircle: {
  width: 80,
  height: 80,
  borderRadius: 40, // Ensures circular shape
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 10,
  overflow: 'hidden', // Ensures cropping inside the borderRadius
},
logoImage: {
  width: '100%', // Fills the parent container
  height: '100%', // Fills the parent container
  borderRadius: 40, // Ensures the image is cropped within the circle
  resizeMode: 'cover', // Ensures the image scales correctly
},

  featuresContainer: { marginVertical: 40 },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 16, elevation: 3,
  },
  featureIcon: { fontSize: 24, marginRight: 10 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  featureDescription: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' },

  buttonContainer: { marginBottom: height * 0.05 },
  getStartedButton: {
    backgroundColor: 'white', height: 54, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginBottom: 16, elevation: 6,
  },
  getStartedText: { color: '#4F67FF', fontSize: 18, fontWeight: 'bold' },

  googleButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 54,
    borderRadius: 12, justifyContent: 'center', marginBottom: 16, elevation: 6, paddingHorizontal: 20,
  },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontSize: 16, fontWeight: '600', color: '#333' },
});

export default WelcomeScreen;