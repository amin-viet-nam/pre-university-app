import Bugsnag from '@bugsnag/expo';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import firebase from './src/DataStorages/FirebaseApp';

import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {AppContext} from './src/Contexts/AppContext';

import NavigatorService from './src/Services/NavigatorService';
import NotificationUtils from "./src/Utils/NotificationUtils";

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
            if (this.state.loading !== loading) {
                this.setState({loading});
            }
        }
    };


    async checkNewCode() {
        try {
            if (!__DEV__) {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync()
                        .then(value => {
                            this.setState({
                                loading: false
                            })
                        })
                }
            }
        } catch (e) {
            // handle or log error
            console.log(e);
            this.setState({
                loading: false
            })
        }
    }

    async componentDidMount() {
        await Bugsnag.start();
        await this.checkNewCode();

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);

        this.setState({...this.state, isReady: true});

        this.anonymousFirebaseLogin();
    }

    anonymousFirebaseLogin() {

        firebase.auth().signInAnonymously()
            .then((auth) => {
                this.setState({...this.state, isReady: true}, () => {
                    this.registerForPushNotificationsAsync().then(token => {
                        if (token) {
                            firebase.database().ref(`users/${auth.user.uid}`)
                                .set({
                                    expoPushToken: token
                                })
                        }
                    });
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                Alert.alert(`Xảy ra lỗi', 'Đã xảy ra lỗi khi xác thực người dùng, mã lỗi : ${errorCode} - ${errorMessage}`);

                console.error(error);
                setTimeout(() => {
                    this.anonymousFirebaseLogin()
                }, 5000)
            });

    }

    async registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
            const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        await AsyncStorage.getItem('user_reminder')
            .then((rawData) => {
                if (rawData === null) {
                    const selectedDayInWeek = [1, 2, 4, 5];
                    const reminderTime = 38700000;
                    NotificationUtils.SaveAndUpdateReminderData(selectedDayInWeek, reminderTime);
                }
            })
        return token;
    }

    render() {
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
