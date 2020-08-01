import { AppLoading } from 'expo';
import React, { Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import NavigatorService from './src/Services/NavigatorService';

import HomeScreen from './src/Screens/HomeScreen';
import CategoryDetailScreen from './src/Screens/CategoryDetailScreen';
import QuestionScreen from './src/Screens/QuestionScreen';

import AboutMeScreen from './src/Screens/AboutMeScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  state = {
    isReady: false
  };

  async componentDidMount() {
    await Font.loadAsync(
      'antoutline',
      require('@ant-design/icons-react-native/fonts/antoutline.ttf')
    );

    await Font.loadAsync(
      'antfill',
      require('@ant-design/icons-react-native/fonts/antfill.ttf')
    );

    this.setState({ ...this.state, isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <SafeAreaProvider>
        <NavigationContainer ref={(el) => NavigatorService.setContainer(el)}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen}/>
            <Stack.Screen name="QuestionScreen" component={QuestionScreen}/>
            <Stack.Screen name="AboutMeScreen" component={AboutMeScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

// class CounterContainer extends Component {
//   state = {
//     count: null,
//   };

//   componentDidMount() {
//     firebase.database().ref('counter').on('value', snapshot => {
//       let count = snapshot.val().count;
//       this.setState({ count });
//     });
//   }

//   render() {
//     return <Counter count={this.state.count} />;
//   }
// }

// class Counter extends Component {
//   render() {
//     let { count } = this.props;

//     return (
//       <View>
//         <Text style={styles.counterText}>
//           Current count: {count === null ? 'Zero' : count}
//         </Text>
//         <Button type="primary" onPress={this._increaseCount}>Add one</Button>
//         <WhiteSpace />
//         <Button type="warning" onPress={this._decreaseCount}>Decrease one</Button>
//       </View>
//     );
//   }

//   };
// }