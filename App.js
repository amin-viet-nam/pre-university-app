import { AppLoading } from 'expo';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import React, { Component } from 'react';
import {StatusBar} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {AppContext} from './src/Contexts/AppContext';

import NavigatorService from './src/Services/NavigatorService';

import HomeScreen from './src/Screens/HomeScreen';
import CategoryScreen from './src/Screens/CategoryScreen';
import CategoryDetailScreen from './src/Screens/CategoryDetailScreen';
import QuestionScreen from './src/Screens/QuestionScreen';

import AboutMeScreen from './src/Screens/AboutMeScreen';

const Stack = createStackNavigator();


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default class App extends Component {
  state = {
    isReady: false,
    loading: false,
    setLoading: (loading) => {
      if(this.state.loading !== loading) {
        this.setState({ loading });
      }
    }
  };

  async componentDidMount() {
     AsyncStorage.getItem('user_reminder')
      .then((rawData) => {
        if (rawData === null) {
            const defaultReminder = {
                selectedDayInWeek: [1,2,4,5],
                reminderTime : 38700000
            };
            AsyncStorage.setItem('user_reminder', JSON.stringify(defaultReminder));
        }
      })

    this.registerForPushNotificationsAsync().then(token => {
      this.setState({
        expoPushNotificationToken: token
      })
    });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);

    this.setState({ ...this.state, isReady: true });
  }


  async registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <AppContext.Provider value={this.state}>
            <NavigationContainer ref={(el) => NavigatorService.setContainer(el)}>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name="CategoryScreen" component={CategoryScreen}/>
                <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen}/>
                <Stack.Screen name="QuestionScreen" component={QuestionScreen}/>
                <Stack.Screen name="AboutMeScreen" component={AboutMeScreen}/>
              </Stack.Navigator>
            </NavigationContainer>
            <StatusBar
              barStyle="dark-content"
            />
            <Spinner
                visible={this.state.loading}
                textStyle={{color: '#fff'}}
                cancelable={true}
                textContent={'Đang Tải...'}
              />          
          </AppContext.Provider>
        </SafeAreaProvider>
      </ApplicationProvider>
    );
  }
}