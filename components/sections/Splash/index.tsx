import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const {width , height} = Dimensions.get('screen')
export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#000000', '#1C1C1C', '#2A2A2A']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>SUB<Text style={styles.plusIcon}>+</Text></Text>
      </View>

      {/* Welcome Text */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.description}>
          Your subscriptions, your control!{'\n'}
          Manage them with ease and keep track of your expenses.
        </Text>
        <Text style={styles.question}>
          Ready for better financial management?
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Let’s start</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    height,
    width
  },
  logoContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  plusIcon: {
    color: '#FF4D4D',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  question: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});