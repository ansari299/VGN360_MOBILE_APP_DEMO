import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { updateAuthData } = useAuth();
  const [mobile, setMobile] = useState('');
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scaleValue = new Animated.Value(1);
  const translateYValue = new Animated.Value(0);

  //for live
  // const generateOtp = async () => {
  //   if (!mobile || mobile.length !== 10) {
  //     Alert.alert('Invalid Number', 'Enter 10-digit mobile number');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `https://www.vgn360.com/MobileApp_API/GenerateOtpCode?MobileNo=${mobile}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     console.log('OTP Response:', data);

  //     if (data.success && data.data.deliveryStatus === "DELIVRD") {
  //      // updateAuthData({ mobile });
      
  //      updateAuthData({ mobile: '9884358122' });
  //       navigation.navigate('OTP', { 
  //         generatedOtp: data.data.OTPCode,
  //         mobile: mobile,
  //         otpDeliveryConfirmed: true
  //       });
  //     } else {
  //       // If delivery failed but we still want to proceed (for testing)
  //      // updateAuthData({ mobile });
  //       updateAuthData({ mobile: '9884358122' });
  //       navigation.navigate('OTP', { 
  //         generatedOtp: '',
  //         mobile: mobile,
  //         otpDeliveryConfirmed: false
  //       });
  //       Alert.alert('OTP Sent', 'Please check your SMS for the OTP code');
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     Alert.alert('Error', 'Failed to connect to server. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  //for test
const generateOtp = async () => {
  const mobile = '9884358122';
  const generatedOtp = '1234'; // Replace with your actual OTP logic if any

  updateAuthData({ mobile });

  navigation.navigate('OTP', {
    generatedOtp,
    mobile,
    otpDeliveryConfirmed: true,
  });
};

  const handleGetOTP = () => {
    if (mobile.length === 10) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start(() => {
        generateOtp();
      });
    } else {
      Animated.sequence([
        Animated.timing(translateYValue, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(translateYValue, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(translateYValue, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        })
      ]).start();
      Alert.alert('Invalid Number', 'Enter 10-digit mobile number');
    }
  };

  const animatedScaleStyle = {
    transform: [{ scale: scaleValue }]
  };

  const animatedTranslateStyle = {
    transform: [{ translateY: translateYValue }]
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.curve} />
          </View>

          <Animated.View style={[styles.logoContainer, animatedTranslateStyle]}>
            <Image
              source={require('../assets/vgn360-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome Back! </Text>
            <Text style={styles.subTextN}>Your Property, In Your Pocket!</Text>
          </Animated.View>

          <Animated.View style={[styles.inputContainer, animatedTranslateStyle]}>
            <Text style={[
              styles.label,
              (focused || mobile) && styles.labelFloating
            ]}>
              Mobile Number
            </Text>
            <TextInput
              placeholder={focused ? '' : ''}
              keyboardType="number-pad"
              maxLength={10}
              style={[
                styles.input,
                focused && styles.inputFocused,
                mobile.length === 10 && styles.inputValid
              ]}
              value={mobile}
              onChangeText={setMobile}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, animatedScaleStyle]}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleGetOTP}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Generating OTP...' : 'Get OTP'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 150,
    backgroundColor: '#b4151a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  curve: {
    position: 'absolute',
    bottom: -50,
    width: '200%',
    height: 100,
    backgroundColor: '#f8f8f8',
    borderRadius: 100,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTextN: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b4151a',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 30,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 15,
    top: 15,
    fontSize: 16,
    color: '#888',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  labelFloating: {
    top: -10,
    fontSize: 12,
    color: '#b4151a',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputFocused: {
    borderColor: '#b4151a',
    borderWidth: 2,
  },
  inputValid: {
    borderColor: '#4CAF50',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#b4151a',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#b4151a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});