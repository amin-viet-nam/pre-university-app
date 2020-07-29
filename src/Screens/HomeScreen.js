import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import { Grid } from '@ant-design/react-native';
import SkeletonContent from 'react-native-skeleton-content';
import firebase from '../DataStorages/FirebaseApp';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: []
        }
    }

    componentDidMount() {
        firebase.database().ref('categories')
            .once('value', snapshot => {
                if (snapshot.val()) {
                    this.setState({
                        categoryList: snapshot.val()
                    }); 
                } else {
                    this.setState({
                        categoryList: [{icon: 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png', text: 'Lỗi 500: Chưa cấu hình categories'}]
                    });                    
                }
            });
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
                    <Grid
                        data={categoryList}
                        columnNum={2}
                        itemStyle={{ height: 150, width: 150}}
                        onPress={(_el, index) => alert(index)}
                        />
                </SkeletonContent>
            </ScrollView>
          </SafeAreaView>
        );
      }   
}