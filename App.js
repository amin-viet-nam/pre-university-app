import { AppLoading } from 'expo';
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import { Button, WhiteSpace } from '@ant-design/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './src/Components/TabBarComponent';
import * as Font from 'expo-font';


// import BasicTabBarExample from './src/Components/TabBarComponent'

const config = {
  apiKey: "AIzaSyDsJvZ8qvEILK1DrwWPVzJftyRvpprbtdw",
  authDomain: "amin-preuniversity-examination.firebaseapp.com",
  databaseURL: "https://amin-preuniversity-examination.firebaseio.com",
  projectId: "amin-preuniversity-examination",
  storageBucket: "amin-preuniversity-examination.appspot.com",
  messagingSenderId: "652459301860",
  appId: "1:652459301860:web:cd0c80f5952007e0da45f1",
  measurementId: "G-FZN7B9F058"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
} catch (e) {
  console.error('App reloaded, so firebase did not re-initialize', e);
}

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
      <NavigationContainer>
        <MyTabs/>
      </NavigationContainer>
      
    );
  }
}

  //     {/* // <View> */}
  //     <View style={styles.container}>
  //     <CounterContainer />
  //   </View>
  // {/* // </View> */}

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

//   _increaseCount = () => {
//     firebase.database().ref('counter').set({
//       count: (this.props.count || 0) + 1,
//     });
//   };

//   _decreaseCount = () => {
//     firebase.database().ref('counter').set({
//       count: (this.props.count || 0) - 1,
//     });
//   };
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
