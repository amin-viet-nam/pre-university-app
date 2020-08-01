import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, FlatList, View, Image } from 'react-native';
import {Card} from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import {MaterialCommunityIcons} from 'react-native-vector-icons';


export default class CategoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [{
                "icon" : "math-compass",
                "text" : "Toán Học"
              }, {
                "icon" : "thermometer",
                "text" : "Vật Lý"
              }, {
                "icon" : "flask",
                "text" : "Hóa Học"
              }, {
                "icon" : "book-open",
                "text" : "Ngữ Văn"
              }, {
                "icon" : "history",
                "text" : "Lịch Sử"
              }, {
                "icon" : "earth",
                "text" : "Địa Lý"
              }, {
                "icon" : "table",
                "text" : "Tiếng Anh"
              }, {
                "icon" : "human",
                "text" : "Sinh Học"
              }, {
                "icon" : "teach",
                "text" : "GDCD"
              }]
        }
    }

    componentDidMount() {
        // firebase.database().ref('categories')
        //     .once('value', snapshot => {
        //         if (snapshot.val()) {
        //             this.setState({
        //                 categoryList: snapshot.val()
        //             }); 
        //         } else {
        //             this.setState({
        //                 categoryList: [{icon: 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png', text: 'Lỗi 500: Chưa cấu hình categories'}]
        //             });                    
        //         }
        //     });
    }

    render() {
        const {categoryList} = this.state;
        return (
          <SafeAreaView style={{ justifyContent: 'center', flex: 1, padding: 4, backgroundColor: '#ffb2dd' }}>
            <FlatList
              data={categoryList}
              renderItem={({ item, index }) => (
                <View style={{ flex: 1, flexDirection: 'column', margin: 4}}>
                  <Ripple>
                    <Card
                      containerStyle={{padding: 16, margin: 4, backgroundColor: 'white', borderRadius: 8, 
                      shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
                    >
                        <MaterialCommunityIcons name={item.icon} size={50} style={{textAlign: 'center'}} />
                        <Text style={{fontSize: 20, textAlign: 'center'}}>
                            {item.text}
                        </Text>
                    </Card>
                  </Ripple>
                </View>
              )}
              //Setting the number of column
              numColumns={2}
              keyExtractor={(item, index) => index}
            />
          </SafeAreaView>
        );
      }   
}
