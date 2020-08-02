import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, View, Alert, Dimensions } from 'react-native';
import {Card} from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import { Layout, ViewPager } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AppContext} from '../Contexts/AppContext';
import firebase from '../DataStorages/FirebaseApp';
import HTML from "react-native-render-html";
import { ScrollView } from 'react-native-gesture-handler';

export default class QuestionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.categoryShortTitleMap = {
          "math": "Toán",
          "physical": "Vật Lý",
          "chemistry": "Hóa",
          "literary": "Văn",
          "history": "Sử",
          "geography": "Địa",
          "english": "Tiếng Anh",
          "biological": "Sinh",
          "civic-education": "GDCD"
        };

        this._viewPage = null;

        const params = this.props.route.params;
        const categoryItem = params.item;
        this.state = {
          categoryItem: categoryItem,
          categoryDetailItem: null,
          currentPage: 0
        };
        
        this.props.navigation.setOptions({
            title: `Giải Đề ${this.categoryShortTitleMap[categoryItem.category]} ${categoryItem.name}`,
            headerTintColor: '#212121',
            headerStyle: {
                backgroundColor: '#f8bbd0'
            },
            cardStack: {
              gesturesEnabled: false,
            }
        });
    }

    componentDidMount() {
        this.context.setLoading(true);
        const categoryItem = this.state.categoryItem;

        firebase.database().ref(`categoryDetails/${categoryItem.id}`)
            .once('value', snapshot => {
                this.context.setLoading(false);
                if (snapshot.val()) {
                    const categoryDetailObj = snapshot.val();
                    this.setState({
                        categoryDetailItem: snapshot.val()
                    }, () => {
                      this.props.navigation.setOptions({
                          title: `Giải Đề ${this.categoryShortTitleMap[categoryItem.category]} ${this.state.categoryDetailItem.name}`,
                      });
                    }); 
                } else {
                    this.setState({
                        categoryDetailItem: []
                    }, () => {
                        setTimeout(() => {
                            Alert.alert('Thông báo', 'Đã xảy ra lỗi, Dữ liệu bạn truy vấn không tồn tại')
                        }, 100);
                    });      
                }
            });
    }

    handleEndQuestion() {
      Alert.alert('Thông báo', 'Xin Chào');
    }

    gotoPage(page) {
      this.setState({currentPage: page})
    }

    renderBookMark() {
      const {categoryDetailItem, currentPage} = this.state;
      if (!categoryDetailItem) {
        return (<Text>Chưa khởi tạo dữ liệu</Text>)
      }
      const questions = categoryDetailItem.questions;      
      const deviceWidth = Dimensions.get('window').width
      return (
        <View style={{padding: 4}}>
          <FlatList
            data={questions}
            numColumns={parseInt(deviceWidth / 30)}
            extraData={currentPage}
            renderItem={({item, index}) => {
              return (
                <View 
                  key={`bookmark-item-${index}`}
                  style={{
                      backgroundColor: index === currentPage ? "#f48fb1" : "#a4a4a4",
                      width: 25,
                      height: 25,
                      margin: 2,
                      justifyContent: "center"
                  }}>
                  <Ripple 
                    onPressIn={() => {
                      this.gotoPage(index);
                    }}
                  >
                    <Text style={{textAlign: 'center', color: '#fff'}}>{index + 1}</Text>
                  </Ripple>
                </View>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
      )
    }

    renderBottomBar() {
      const {categoryDetailItem, currentPage} = this.state;
      if (!categoryDetailItem) {
        return (<Text>Chưa khởi tạo dữ liệu</Text>)
      }

      const questions = categoryDetailItem.questions;
      return (
        <View style={{backgroundColor: '#f06292', flexDirection: 'row', padding: 12}}>
          <View style={{flex: 1}}>
            <Ripple 
              onPress={() => {
                if (currentPage > 0) {
                  this.gotoPage(currentPage - 1);
                }
              }}
            >
              <MaterialCommunityIcons name="arrow-left-bold" color="#fff" size={30} 
                style={{textAlign: 'left', marginLeft: 4, 
                  display: currentPage == 0 ? 'none' : 'flex'
                }}/>  
            </Ripple>
          </View>
          <View style={{flex: 4}}>
            <Ripple 
              onPress={() => {
                this.handleEndQuestion()
              }}
            >
              <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name="calendar-account" color="#fff" size={30} style={{textAlign: 'center'}} />
                <Text style={{color: '#fff', fontSize: 18}}>Nộp bài</Text>
              </View>
            </Ripple>
          </View>
          <View style={{flex: 1, }}>
            <Ripple 
              onPress={() => {
                if (currentPage < questions.length - 1) {
                  this.gotoPage(currentPage + 1);
                }
              }}
            >
              <MaterialCommunityIcons name="arrow-right-bold" color="#fff" size={30} 
                style={{textAlign: 'right', marginRight: 4,
                  display: currentPage == questions.length - 1 ? 'none' : 'flex'
                }} />
            </Ripple>
          </View>
        </View>      
      )
    }

    renderViewPage() {
      const {categoryDetailItem, currentPage} = this.state;
      if (!categoryDetailItem) {
        return (<Text>Chưa khởi tạo dữ liệu</Text>)
      }
      const questions = categoryDetailItem.questions;  
      return (
        <View style={{padding: 4, flex: 1,  backgroundColor: '#fafafa'}}>
          <ViewPager 
            ref={(ref) => this._viewPage = ref}
            style={{flex: 1}} 
            selectedIndex={currentPage}
            shouldLoadComponent={(index) => index === currentPage}
            onSelect={index => {
              this.setState({currentPage: index});
            }}
          >
            {questions.map((item, questionIndex) => {
              return (
                <Layout key={`viewpage-item-${questionIndex}`}  style={{flex: 1,  backgroundColor: '#fafafa'}}>
                  <ScrollView style={{flex: 1}}>
                    <HTML
                      baseFontStyle={{fontSize: 20}}
                      html={item.ask}
                      imagesMaxWidth={Dimensions.get("window").width}
                    />
                    {item.choices.map((choice, choiceIndex) => {
                      return (
                        <View key={`question-choice-${item.id}-${choiceIndex}`}>
                          <HTML
                            baseFontStyle={{fontSize: 18}}
                            html={choice}
                            imagesMaxWidth={Dimensions.get("window").width}
                          />
                        </View>
                      )
                    })}
                  </ScrollView>
                </Layout>
              )
            })}
          </ViewPager>
        </View>  
      )
    }
  
    render() {
        const {categoryDetailItem, currentPage} = this.state;
        if (!categoryDetailItem) {
          return (<Text>Đang tải dữ liệu ...</Text>)
        }
        return (
          <View style={{flex: 1}}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa'}}>
              {this.renderBookMark()}
              {this.renderViewPage()}
            </SafeAreaView>
            {this.renderBottomBar()}
          </View>
        );
      }   
}
QuestionScreen.contextType = AppContext;