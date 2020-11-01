import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, View, Alert } from 'react-native';
import { Card } from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import NavigatorService from '../../src/Services/NavigatorService';
import {AppContext} from '../Contexts/AppContext';
import firebase from '../DataStorages/FirebaseApp';

export default class CategoryDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        const colorMap = {
            "math": {
                "primaryColor": "#c8e6c9",
                "secondaryColor": "#f1f8e9"
            },
            "physical": {
                "primaryColor": "#f8bbd0",
                "secondaryColor": "#ffeeff"
            },
            "chemistry": {
                "primaryColor": "#fff1ff",
                "secondaryColor": "#e1bee7"
            },
            "literary": {
                "primaryColor": "#bbdefb",
                "secondaryColor": "#eeffff"
            },
            "history": {
                "primaryColor": "#b3e5fc",
                "secondaryColor": "#e6ffff"
            },
            "geography": {
                "primaryColor": "#b2ebf2",
                "secondaryColor": "#e5ffff"
            },
            "english": {
                "primaryColor": "#b2dfdb",
                "secondaryColor": "#e5ffff"
            },
            "biological": {
                "primaryColor": "#c8e6c9",
                "secondaryColor": "#fbfffc"
            },
            "civic-education": {
                "primaryColor": "#ffccbc",
                "secondaryColor": "#ffffee"
            }
        };
        const params = this.props.route.params;
        this.state = {
            categoryDetail: params.item,
            categoryDetailList: [],
            layoutColor: colorMap[params.item.id] || {
                    "primaryColor": "#c8e6c9",
                    "secondaryColor": "#f1f8e9"
                }
        };
        this.props.navigation.setOptions({
            title: "Giải Đề " + this.state.categoryDetail.text, 
            headerTintColor: '#212121',
            headerStyle: {
                backgroundColor: this.state.layoutColor.primaryColor
            }
        });
    }

    componentDidMount() {
        this.context.setLoading(true);

        firebase.database().ref(`categories/${this.state.categoryDetail.id}`)
            .once('value', snapshot => {
                this.context.setLoading(false);
                if (snapshot.val()) {
                    const categoryDetailObj = snapshot.val();
                    this.setState({
                        categoryDetailList: Object.keys(categoryDetailObj)
                            .map(k => categoryDetailObj[k])
                            .filter(f => f.hide !== true)
                            .map(m => ({
                                id: m.id,
                                category: this.state.categoryDetail.id,
                                name: m.name,
                                hide: m.hide === true,
                            }))
                            .sort((a, b) => -(a.name - b.name))
                    }); 
                } else {
                    this.setState({
                        categoryDetailList: []
                    }, () => {
                        setTimeout(() => {
                            Alert.alert('Thông báo', 'Chưa có đề thi phù hợp với truy vấn, Vui lòng quay lại sau')
                        }, 100);
                    });      
                }
            });
    }

    categoryDetailItemClick(item) {
        console.log('categoryDetailItemClick', item);
        NavigatorService.navigate('QuestionScreen', {item});
      }

    render() {
        const {categoryDetailList, layoutColor} = this.state;
        return (
        <SafeAreaView style={{ justifyContent: 'center', flex: 1, padding: 4, backgroundColor: layoutColor.secondaryColor }}>
            <FlatList
            data={categoryDetailList}
            numColumns={3}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column', margin: 4}}>
                    <Card
                    style={{margin: 4, backgroundColor: layoutColor.primaryColor, borderRadius: 4, 
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
                    >
                    <Ripple style={{padding: 16}} onPress={ () => this.categoryDetailItemClick(item)}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: '#212121'}}>
                            Đề thi {item.name}
                        </Text>
                    </Ripple>
                    </Card>
                </View>
            )}
            />
        </SafeAreaView>
        );
    }   
}
CategoryDetailScreen.contextType = AppContext;