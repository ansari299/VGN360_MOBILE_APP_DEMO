import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './screens/AuthContext'; // Add this import
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import Dashboard from './screens/Dashboard';
import EnquiryForm from './screens/EnquiryForm';
import ReferalForm from './screens/ReferalForm';
import BookedHistory from './screens/BookedHistory';
import AdScreen from './screens/AdScreen';
import ProjectDetails from './screens/ProjectDetails';
import ReceiptDetails from './screens/ReceiptDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
         <Stack.Navigator initialRouteName="Splash"> 
           {/* <Stack.Navigator initialRouteName="Dashboard"> */}
           <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }}
      />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="OTP" 
            component={OTPScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdScreen"  
            component={AdScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{ 
              headerShown: false,
              title: 'Dashboard',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="EnquiryForm" 
            component={EnquiryForm}
            options={({ navigation }) => ({
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.navigate('Dashboard')}
                  tintColor="#fff"
                />
              )
            })}
          />
          <Stack.Screen 
            name="ReferalForm" 
            component={ReferalForm}
            options={({ navigation }) => ({
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.navigate('Dashboard')}
                  tintColor="#fff"
                />
              )
            })}
          />
          <Stack.Screen 
            name="BookedHistory" 
            component={BookedHistory}
            options={{ 
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="ProjectDetails" 
            component={ProjectDetails} 
            options={{ 
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
            }}
          />
           <Stack.Screen 
            name="ReceiptDetails" 
            component={ReceiptDetails} 
            options={{ 
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: '#b4151a' },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}