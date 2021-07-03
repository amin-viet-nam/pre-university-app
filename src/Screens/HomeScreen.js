import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import CategoryScreen from './CategoryScreen';
import NotificationScreen from './NotificationScreen';
import ReminderScreen from './ReminderScreen';

const Tab = createBottomTabNavigator();

function TabBarComponent() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#c94f7c',
            }}
        >
            <Tab.Screen
                name="Home"
                component={CategoryScreen}
                options={{
                    tabBarLabel: 'Trang Chủ',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Reminder"
                component={ReminderScreen}
                options={{
                    tabBarLabel: 'Nhắc học bài',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="alarm" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    tabBarLabel: 'Thông Báo',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default TabBarComponent;
