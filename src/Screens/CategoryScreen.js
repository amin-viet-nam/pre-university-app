import {FlatList, Text, View} from 'react-native';

import {AdMobBanner} from "expo-ads-admob";
import AdmobUtils from "../Utils/AdmobUtils";
import {Card} from '@ui-kitten/components';
import {MaterialCommunityIcons} from 'react-native-vector-icons';
import NavigatorService from '../../src/Services/NavigatorService';
import React from 'react';
import Ripple from 'react-native-material-ripple';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class CategoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showBannerAds: false,
            categoryList: [{
                "id": "math",
                "icon": "math-compass",
                "text": "Toán Học"
            }, {
                "id": "physical",
                "icon": "thermometer",
                "text": "Vật Lý"
            }, {
                "id": "chemistry",
                "icon": "flask",
                "text": "Hóa Học"
            }, {
                "id": "literary",
                "icon": "book-open",
                "text": "Ngữ Văn"
            }, {
                "id": "history",
                "icon": "history",
                "text": "Lịch Sử"
            }, {
                "id": "geography",
                "icon": "earth",
                "text": "Địa Lý"
            }, {
                "id": "english",
                "icon": "table",
                "text": "Tiếng Anh"
            }, {
                "id": "biological",
                "icon": "human",
                "text": "Sinh Học"
            }, {
                "id": "civic-education",
                "icon": "teach",
                "text": "GDCD"
            }]
        }
    }

    componentDidMount() {
        AdmobUtils.shouldShowBannerAds().then(ok => {
            this.setState({
                showBannerAds: ok
            })
        });
    }

    categoryItemOnClick(item) {
        console.log('categoryItemOnClick: ', item);
        NavigatorService.navigate('CategoryDetailScreen', {item});
    }

    renderAdmob() {
        const {showBannerAds} = this.state;
        if (showBannerAds) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <AdMobBanner
                        bannerSize="mediumRectangle"
                        adUnitID={AdmobUtils.bannerAds}
                        onDidFailToReceiveAdWithError={(err) => {
                            console.log('load banner ads error', err)
                        }}/>
                </View>
            );
        }
        return (<View/>);
    }

    render() {
        const {categoryList} = this.state;
        return (
            <SafeAreaView style={{justifyContent: 'center', flex: 1, padding: 4, backgroundColor: '#f8bbd0'}}>
                <View>
                    <FlatList
                        ListHeaderComponent={this.renderAdmob()}
                        data={categoryList}
                        numColumns={2}
                        keyExtractor={(item, index) => `category-item-${index}`}
                        renderItem={({item, index}) => (
                            <View style={{flex: 1, flexDirection: 'column', margin: 4}}>
                                <Ripple style={{padding: 0}} onPress={() => this.categoryItemOnClick(item)}>
                                    <Card
                                        style={{
                                            margin: 4,
                                            backgroundColor: 'white',
                                            borderRadius: 4,
                                            shadowColor: "#000",
                                            shadowOffset: {width: 0, height: 2,},
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                        }}
                                    >
                                        <MaterialCommunityIcons name={item.icon} size={50}
                                                                style={{textAlign: 'center'}}/>
                                        <Text style={{fontSize: 20, textAlign: 'center'}}>
                                            {item.text}
                                        </Text>
                                    </Card>
                                </Ripple>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
