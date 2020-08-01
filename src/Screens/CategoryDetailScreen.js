import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, View } from 'react-native';
import {Card} from 'react-native-elements';
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
            detail: params.item,
            categoryDetailList: [],
            layoutColor: colorMap[params.item.id] || {
                    "primaryColor": "#c8e6c9",
                    "secondaryColor": "#f1f8e9"
                }
        };
        this.props.navigation.setOptions({
            title: "Giải Đề " + this.state.detail.text, 
            headerTintColor: '#212121',
            headerStyle: {
                backgroundColor: this.state.layoutColor.primaryColor
            }
        });
    }

    componentDidMount() {
        this.context.setLoading(true);

        firebase.database().ref('categories')
            .once('value', snapshot => {
                this.context.setLoading(false);
                if (snapshot.val()) {
                    this.setState({
                        categoryDetailList: snapshot.val()
                    }); 
                } else {
                    this.setState({
                        categoryDetailList: [{id: 'categories-not-found', selectable: false, text: 'Đã xảy ra lỗi vui lòng liên hệ quản trị'}]
                    });                    
                }
            });
    }

    categoryItemOnClick(item) {
        if (item.selectable === false) {
            
        } else { 
            NavigatorService.navigate('AboutMeScreen', {item});
        }
      }
  
      render() {
          const {categoryDetailList, layoutColor} = this.state;
          return (
            <SafeAreaView style={{ justifyContent: 'center', flex: 1, padding: 4, backgroundColor: layoutColor.secondaryColor }}>
                <AppContext.Consumer>
                    {({loading, setLoading}) => {
                        // setLoading(this.state.loading)
                    }}
                </AppContext.Consumer>
              <FlatList
                data={categoryDetailList}
                numColumns={3}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => (
                  <View style={{ flex: 1, flexDirection: 'column', margin: 4}}>
                      <Card
                        containerStyle={{margin: 4, backgroundColor: layoutColor.primaryColor, borderRadius: 8, 
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}
                      >
                        <Ripple style={{padding: 16}} onPress={ () => this.categoryItemOnClick(item)}>
                          <Text style={{fontSize: 20, textAlign: 'center', color: '#212121'}}>
                              Đề thi số {item.id}
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