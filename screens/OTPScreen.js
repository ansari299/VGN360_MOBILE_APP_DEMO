import React, { useState, useRef, useEffect } from 'react';
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
  Keyboard,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

export default function OTPScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { generatedOtp, mobile, otpDeliveryConfirmed } = route.params;
  const { updateAuthData } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef([]);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('OTP Screen mounted with params:', {
      generatedOtp,
      mobile,
      otpDeliveryConfirmed
    });

    // Auto-fill OTP if we have it and delivery was confirmed
    if (otpDeliveryConfirmed && generatedOtp && generatedOtp.length === 4) {
      const otpArray = generatedOtp.split('');
      setOtp(otpArray);
      //Alert.alert('OTP Received', 'We have auto-filled the OTP for you');
    }
  }, []);

  const focusNext = (index, value) => {
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const focusPrevious = (index, key) => {
    if (key === 'Backspace' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

   //for live
  // const verifyOtp = async () => {
  //   const enteredOtp = otp.join('');
  //   if (enteredOtp.length !== 4) {
  //     shakeAnimation();
  //     Alert.alert('Invalid OTP', 'Please enter 4-digit OTP');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `https://www.vgn360.com/MobileApp_API/GetOtpCode?MobileNo=${mobile}&OTPCode=${enteredOtp}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     console.log('Verification Response:', data);

  //     if (Array.isArray(data) && data[0]?.OTPStatus === 'Succeed') {
  //       Animated.sequence([
  //         Animated.timing(buttonScale, {
  //           toValue: 0.95,
  //           duration: 100,
  //           useNativeDriver: true
  //         }),
  //         Animated.timing(buttonScale, {
  //           toValue: 1,
  //           duration: 200,
  //           easing: Easing.elastic(1.5),
  //           useNativeDriver: true
  //         })
  //       ]).start(() => {
  //         updateAuthData({ isAuthenticated: true, mobile });
  //         navigation.navigate('AdScreen');
  //       });
  //     } else {
  //       shakeAnimation();
  //       Alert.alert('Invalid OTP', 'The OTP you entered is incorrect');
  //     }
  //   } catch (error) {
  //     console.error('Verification error:', error);
  //     Alert.alert('Error', 'Failed to verify OTP. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  //for test
  const verifyOtp = async () => {
  updateAuthData({
    isAuthenticated: true,
    mobile: mobile, // make sure `mobile` is in scope
  });

  navigation.navigate('AdScreen');
};


  const resendOtp = async () => {
    try {
      setIsResending(true);
      const response = await fetch(
        `https://www.vgn360.com/MobileApp_API/GenerateOtpCode?MobileNo=${mobile}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Resend OTP Response:', data);
      
      if (data.success && data.data.deliveryStatus === "DELIVRD") {
        const otpArray = data.data.OTPCode.split('');
        setOtp(otpArray);
        Alert.alert('OTP Resent', 'New OTP has been sent and auto-filled for you');
      } else {
        Alert.alert('OTP Sent', 'Please check your SMS for the OTP code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const shakeAnimation = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    focusNext(index, text);
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

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/vgn360-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>OTP Verification</Text>
            <Text style={styles.subText}>Enter the 4-digit code sent to {mobile}</Text>
          </View>

          <Animated.View 
            style={[
              styles.otpContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={({ nativeEvent: { key } }) => focusPrevious(index, key)}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={verifyOtp}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.resendContainer}
            onPress={resendOtp}
            disabled={isResending}
          >
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <Text style={styles.resendLink}>
              {isResending ? 'Resending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
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
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderColor: '#b4151a',
    borderWidth: 2,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b4151a',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#b4151a',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});