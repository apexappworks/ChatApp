// Imports dependencies.
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ChatClient,
  ChatOptions,
  ChatMessageChatType,
  ChatMessage,
} from 'react-native-agora-chat';

// Defines the App object.
const App = () => {
  const title = 'AgoraChatQuickstart';
  const appKey = '611197883#1388710'; // Make sure this is the correct App Key from the Agora Console
  const [username, setUsername] = React.useState('23');
  const [chatToken, setChatToken] = React.useState(
    '007eJxTYGj5q3ZOJXLtu+XKm5ZH6m8TObSFY+7MfDElydmvTjCd+jpXgSEpxSItJS3VwMgyMdnE1DjR0jjVzMjMwDTV3Mjc1NTI4Av3mbSGQEaG6sRARkYGVgZGBiYGEJ+BAQDBMx4C', // Replace with valid Agora Token
  );
  const [targetId, setTargetId] = React.useState('');
  const [content, setContent] = React.useState('');
  const [logText, setWarnText] = React.useState('Show log area');
  const [isInitialized, setIsInitialized] = React.useState(false); // Track initialization status
  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;

  // Outputs UI logs.
  const rollLog = text => {
    setWarnText(preLogText => {
      let newLogText = text;
      preLogText
        .split('\n')
        .filter((_, index) => index <= 8)
        .forEach(value => {
          newLogText += '\n' + value;
        });
      return newLogText;
    });
  };

  useEffect(() => {
    const setMessageListener = () => {
      const msgListener = {
        onMessagesReceived(messages) {
          messages.forEach(message => {
            rollLog('received msgId: ' + message.msgId);
          });
        },
        // Other listeners can be added here if needed.
      };
      chatManager.removeAllMessageListener();
      chatManager.addMessageListener(msgListener);
    };

    const init = () => {
      const options = new ChatOptions({appKey});
      chatClient.removeAllConnectionListener();
      chatClient
        .init(options)
        .then(() => {
          rollLog('init success');
          setIsInitialized(true); // Set initialized to true
          const listener = {
            onTokenWillExpire() {
              rollLog('token will expire soon.');
            },
            onTokenDidExpire() {
              rollLog('token has expired.');
            },
            onConnected() {
              rollLog('onConnected');
              setMessageListener();
            },
            onDisconnected(errorCode) {
              rollLog('onDisconnected: ' + errorCode);
            },
          };
          chatClient.addConnectionListener(listener);
        })
        .catch(error => {
          rollLog('init fail: ' + JSON.stringify(error));
        });
    };
    init();
  }, [appKey, chatClient, chatManager]);

  const login = () => {
    if (!isInitialized) {
      rollLog('Initialize the SDK first.');
      return;
    }
    rollLog('start login ...');
    chatClient
      .loginWithAgoraToken(username, chatToken)
      .then(() => {
        rollLog('login success');
      })
      .catch(error => {
        rollLog('login failed: ' + JSON.stringify(error));
      });
  };

  const logout = () => {
    if (!isInitialized) {
      rollLog('Initialize the SDK first.');
      return;
    }
    rollLog('start logout ...');
    chatClient
      .logout()
      .then(() => {
        rollLog('logout success.');
      })
      .catch(error => {
        rollLog('logout failed: ' + JSON.stringify(error));
      });
  };

  const sendmsg = () => {
    if (!isInitialized) {
      rollLog('Initialize the SDK first.');
      return;
    }
    const message = ChatMessage.createTextMessage(
      targetId,
      content,
      ChatMessageChatType.PeerChat,
    );
    const callback = {
      onProgress(locaMsgId, progress) {
        rollLog(`send message progress: ${locaMsgId}, ${progress}`);
      },
      onError(locaMsgId, error) {
        rollLog(`send message failed: ${locaMsgId}, ${JSON.stringify(error)}`);
      },
      onSuccess(msg) {
        rollLog('send message success: ' + msg.localMsgId);
      },
    };
    rollLog('start sending message ...');
    chatClient.chatManager
      .sendMessage(message, callback)
      .then(() => {
        rollLog('send message: ' + message.localMsgId);
      })
      .catch(error => {
        rollLog('send message failed: ' + JSON.stringify(error));
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter username"
            onChangeText={setUsername}
            value={username}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter chatToken"
            onChangeText={setChatToken}
            value={chatToken}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.eachBtn} onPress={login}>
            SIGN IN
          </Text>
          <Text style={styles.eachBtn} onPress={logout}>
            SIGN OUT
          </Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter the target username"
            onChangeText={setTargetId}
            value={targetId}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter message content"
            onChangeText={setContent}
            value={content}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.btn2} onPress={sendmsg}>
            SEND TEXT
          </Text>
        </View>
        <View>
          <Text style={styles.logText} multiline={true}>
            {logText}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Sets UI styles.
const styles = StyleSheet.create({
  titleContainer: {
    height: 60,
    backgroundColor: '#6200ED',
  },
  title: {
    lineHeight: 60,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  inputCon: {
    marginLeft: '5%',
    width: '90%',
    height: 60,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputBox: {
    marginTop: 15,
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonCon: {
    marginLeft: '2%',
    width: '96%',
    flexDirection: 'row',
    marginTop: 20,
    height: 26,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eachBtn: {
    height: 40,
    width: '28%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  btn2: {
    height: 40,
    width: '45%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  logText: {
    padding: 10,
    marginTop: 10,
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
  },
});
export default App;
