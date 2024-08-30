// Import React Hooks
import React, {useRef, useState, useEffect} from 'react';
// Import user interface elements
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
// Import components for obtaining Android device permissions
import {PermissionsAndroid, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon library
// Import Agora SDK
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';

// Define basic information
const appId = 'c12d58b1cb254407adc5fdf242dd9992';
const token =
  '007eJxTYLj0XErkut+epXYfwlksok/OKsxPUptv/YVxacLU/ONnpl9SYEg2NEoxtUgyTE4yMjUxMTBPTEk2TUtJMzIxSkmxtLQ08sy8mNYQyMig9NidiZEBAkF8dobw/KLszLx0BgYA2G8hHw==';
const channelName = 'Working';
const uid = 0; // Local user UID, no need to modify

const VoiceCall = ({navigation}) => {
  const agoraEngineRef = useRef(IRtcEngine); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Remote user UID
  const [isMuted, setIsMuted] = useState(false); // Mute state
  const [message, setMessage] = useState(''); // User prompt message
  // Initialize the engine and join the channel when starting the App
  useEffect(() => {
    setupVideoSDKEngine();
    join(); // Automatically join the channel on app load
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after checking and obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      // Register event callbacks
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel: ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has joined');
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has left the channel');
          setRemoteUid(0);
        },
      });
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Define the join method called after clicking the join channel button
  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      // Set the channel profile type to communication after joining the channel
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      // Call the joinChannel method to join the channel
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        // Set the user role to broadcaster
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call the leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('Left the channel');
      navigation.navigate('Dashboard');
    } catch (e) {
      console.log(e);
    }
  };

  // Mute/unmute the microphone
  const toggleMute = () => {
    try {
      if (isMuted) {
        agoraEngineRef.current?.muteLocalAudioStream(false); // Unmute
        showMessage('Unmuted');
      } else {
        agoraEngineRef.current?.muteLocalAudioStream(true); // Mute
        showMessage('Muted');
      }
      setIsMuted(!isMuted);
    } catch (e) {
      console.log(e);
    }
  };
  const imageForEndCall = require('../../../src/assets/phone-call-end.png');
  // Render the user interface
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Agora Voice Call</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined ? (
          <Text style={{color: '#000'}}>Local user UID: {uid}</Text>
        ) : (
          <Text style={{color: '#000'}}>Join a channel</Text>
        )}
        {isJoined && remoteUid !== 0 ? (
          <Text style={{color: '#000'}}>Remote user UID: {remoteUid}</Text>
        ) : (
          <Text style={{color: '#000'}}>Waiting for remote users to join</Text>
        )}
        <Text style={{color: '#000'}}>{message}</Text>
      </ScrollView>
      <View style={styles.footer}>
        {/* End Call Button */}
        <TouchableOpacity style={styles.endButton} onPress={leave}>
          <Image source={imageForEndCall} style={styles.endCallIcon} />
        </TouchableOpacity>

        {/* Mute/Unmute Button */}
        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
          <Icon
            name={isMuted ? 'microphone-slash' : 'microphone'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Display message
  function showMessage(msg) {
    setMessage(msg);
  }
};

// Define user interface styles
const styles = StyleSheet.create({
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  footer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  endButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // Rounded full shape
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20, // Space between buttons
  },
  muteButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // Rounded full shape
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {fontSize: 20, color: '#000', padding: 10},
  endCallIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
});

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default VoiceCall;
