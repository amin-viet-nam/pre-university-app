import React, { Component } from 'react';
import { Text, View } from 'react-native';
import NavigatorService from '../../src/Services/NavigatorService';

export default class CategoryDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = this.props.route.params;
        this.state = {
            detail: params.item
        };
        this.props.navigation.setOptions({'title': "Giải Đề " + this.state.detail.text});
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
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>CategoryDetailScreen!</Text>
            </View>
          );
    }    
}