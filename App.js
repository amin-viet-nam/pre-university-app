import { AppLoading } from 'expo';
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
                selectedDayInWeek: [0,2,3,4],
                reminderTime : 38700000
            };
            AsyncStorage.setItem('user_reminder', JSON.stringify(defaultReminder));
        }
      })

    this.setState({ ...this.state, isReady: true });
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