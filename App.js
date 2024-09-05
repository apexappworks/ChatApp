import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'; // Corrected import

import Dashboard from './src/Dashboard/Dashboard';
import SignupScreen from './src/Authentication/Signup';
import LoginScreen from './src/Authentication/Login';
import ChatScreen from './src/Messaging/ChatScreen';
import CallFunctionality from './src/Calling/VideoCalling/Call';
import VoiceCall from './src/Calling/VoiceCalling/VoiceCall';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Call" component={CallFunctionality} />
        <Stack.Screen name="VoiceCall" component={VoiceCall} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
