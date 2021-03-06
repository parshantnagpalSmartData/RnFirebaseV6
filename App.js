/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App: () => React$Node = () => {
let  unsubscribe;
  
  const firebaseFunctionCall = () =>{
    messaging()
    .getToken()
    .then((fcmToken) => {
      if (fcmToken) {
        console.log("fcmTokenfcmTokenfcmToken",fcmToken)

      } else {
        console.log('[FCMService] User doesnt not have a device token');
      }
    })
    .catch((error) => {
      console.log('[FCMService] getToken rejected', error);
    });

     unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    // Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
});

messaging()
.getInitialNotification()
.then(remoteMessage => {
  if (remoteMessage) {
    console.log(
      'Notification caused app to open from quit state:',
      remoteMessage.notification,
    );
  }

});

  }


 const requestUserPermission = async()=> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      firebaseFunctionCall()
    }
  }

  useEffect(() => {
    if(Platform.OS == "ios"){
      requestUserPermission()
    }else{
      firebaseFunctionCall()
    }
   
    return unsubscribe;
  
  }, [])

  

 
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
