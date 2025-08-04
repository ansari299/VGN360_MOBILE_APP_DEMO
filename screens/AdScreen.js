import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const AdScreen = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();

  return (
    <View style={styles.adContainer}>
      <Image
        source={require('../assets/refferal.jpg')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.replace('Dashboard')}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'black',
    width: 50,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 'bold',
  },
});

export default AdScreen;