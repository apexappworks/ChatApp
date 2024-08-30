import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const checkLogin = async () => {
    const user = auth().currentUser;
    if (user) {
      // If a user is already logged in, navigate to the dashboard
      navigation.navigate('dashboard');
    }
  };

  checkLogin();

  const handleLogin = async () => {
    if (username && password) {
      try {
        // Firebase Auth sign-in method
        await auth().signInWithEmailAndPassword(username, password);
        Alert.alert('Login Successful!', 'Welcome back.');
        navigation.navigate('Dashboard');
      } catch (error) {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'The email address is badly formatted.');
        } else if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'There is no user corresponding to the email.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'The password is incorrect.');
        } else {
          Alert.alert('Error', error.message);
        }
      }
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };
  const handleSignup = () => {
    navigation.navigate('Signup');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        placeholderTextColor="gray"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="gray"
      />
      <Button title="Login" onPress={handleLogin} />
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
          flexDirection: 'row',
        }}>
        <Text style={{color: '#000', marginRight: 30}}>
          Don't have Account?
        </Text>
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default LoginScreen;
