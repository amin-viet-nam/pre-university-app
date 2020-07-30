import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';
import firebase from '../DataStorages/FirebaseApp';
import { Flex, WhiteSpace, WingBlank } from '@ant-design/react-native';
import CardView from 'react-native-cardview';


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [{
                "icon" : "math-compass",
                "text" : "Toán Học"
              }, {
                "icon" : "thermometer-quarter",
                "text" : "Vật Lý"
              }, {
                "icon" : "md-logo-electron",
                "text" : "Hóa Học"
              }, {
                "icon" : "book-open",
                "text" : "Ngữ Văn"
              }, {
                "icon" : "history",
                "text" : "Lịch Sử"
              }, {
                "icon" : "earth-outline",
                "text" : "Địa Lý"
              }, {
                "icon" : "paper-plane",
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
          <SafeAreaView>
            <ScrollView style={{minHeight: '100%', minWidth: '100%'}}>
                <SkeletonContent
                containerStyle={{ flex: 1, width: '100%' }}
                isLoading={categoryList.length === 0}
                layout={[
                    { width: '50%', height: 200, marginBottom: 6 },
                    { width: '50%', height: 200, marginBottom: 6, marginLeft: '50%' },
                    { width: '50%', height: 200, marginBottom: 6 },
                ]}
                >
                    <WingBlank style={{ marginBottom: 5 }}>
                    <Flex>
                        {categoryList.map((item, index) => {
                            return (
                                    <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                                        <CardView
                                            cardElevation={2}
                                            cardMaxElevation={2}
                                            cornerRadius={5}>
                                            <MaterialCommunityIcons name={item.icon}/>
                                            <Text>
                                                {item.text}
                                            </Text>
                                        </CardView>
                                    </Flex.Item>
                            )
                        })}
                    </Flex>
                    </WingBlank>
                </SkeletonContent>
            </ScrollView>
          </SafeAreaView>
        );
      }   
}