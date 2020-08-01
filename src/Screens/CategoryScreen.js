import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import {Card} from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import {MaterialCommunityIcons} from 'react-native-vector-icons';
import NavigatorService from '../../src/Services/NavigatorService';

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

    categoryItemOnClick(item) {
      console.log('categoryItemOnClick: ', item);
      NavigatorService.navigate('CategoryDetailScreen', {item});
    }

    render() {
        const {categoryList} = this.state;
        return (
          <SafeAreaView style={{ justifyContent: 'center', flex: 1, padding: 4, backgroundColor: '#ffb2dd' }}>
            <FlatList
              data={categoryList}
              renderItem={({ item, index }) => (
                <View style={{ flex: 1, flexDirection: 'column', margin: 4}}>
                    <Card
                      containerStyle={{margin: 4, backgroundColor: 'white', borderRadius: 8, 
                      shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
                    >
                      <Ripple style={{padding: 16}} onPress={ () => this.categoryItemOnClick(item)}>
                        <MaterialCommunityIcons name={item.icon} size={50} style={{textAlign: 'center'}} />
                        <Text style={{fontSize: 20, textAlign: 'center'}}>
                            {item.text}
                        </Text>
                      </Ripple>
                    </Card>
                </View>
              )}
              numColumns={2}
              keyExtractor={(item, index) => index}
            />
          </SafeAreaView>
        );
      }   
}
