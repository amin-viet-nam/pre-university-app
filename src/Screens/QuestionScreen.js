import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, View, Alert, Dimensions } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { ViewPager } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AppContext} from '../Contexts/AppContext';
import firebase from '../DataStorages/FirebaseApp';
import QuestionItemComponent from '../Components/QuestionItemComponent';

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
          currentPage: 0,
          lastGotoPageTime: new Date().getTime(),
          answeredQuestions: {},
          autoEndQuestion: true,
          showAllAnswers: false,
        };
        
        this.props.navigation.setOptions({
            title: `Giải Đề ${this.categoryShortTitleMap[categoryItem.category]} ${categoryItem.name}`,
            headerTintColor: '#212121',
            headerStyle: {
                backgroundColor: '#f8bbd0'
            },
            gestureResponseDistance: {
              horizontal: -1,
              vertical: -1,
            },
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

    handleEndAllQuestion() {
      const {categoryDetailItem, answeredQuestions} = this.state;
      const questions = categoryDetailItem.questions;
      const pointPerCorrectAnswer = 10 / questions.length;
      const correctAnswer = Object.keys(answeredQuestions)
                              .filter(f => answeredQuestions[f] === questions[f].answer)
                              .length;
      const totalScore = Math.round((pointPerCorrectAnswer * correctAnswer + Number.EPSILON) * 100) / 100

      this.setState({
        showAllAnswers: true
      }, () => {
        Alert.alert('Chấm điểm', `Điểm số của bạn là : ${totalScore}`);
      });
    }

    getNextNotAnsweredQuestion() {
      const {answeredQuestions, categoryDetailItem, currentPage} = this.state;

      let nextPage = -1;
      for(let i=currentPage + 1; i < categoryDetailItem.questions.length; i++) {
        if (typeof answeredQuestions[i] === 'undefined') {
          nextPage = i;
          break;
        }
      }
      
      if (nextPage === -1) {
        for(let i=0; i < currentPage; i++) {
          if (typeof answeredQuestions[i] === 'undefined') {
            nextPage = i;
            break;
          }
        }        
      }
      return nextPage;
    }

    handleQuestionAnswerSelected(questionItem, questionIndex, selectedAnswerIndex) {
      const {answeredQuestions, currentPage} = this.state;
      const nextPage = this.getNextNotAnsweredQuestion();
      
      this.setState({
        answeredQuestions: {
          ...answeredQuestions,
          [questionIndex]: selectedAnswerIndex
        },
        currentPage: nextPage !== -1 ? nextPage: currentPage
      }, () => {
        if (nextPage === -1 && this.state.autoEndQuestion) {
          this.showAlertEndQuestionConfirm();
        }
      });
    }

    showAlertEndQuestionConfirm() {
      const nextPage = this.getNextNotAnsweredQuestion();
      if (nextPage !== -1) {
        Alert.alert(
          "Cảnh báo",
          "Bạn còn câu hỏi chưa hoàn thành, Bạn có muốn nộp bài thi chưa ?",
          [
            {
              text: "Làm tiếp nha",
              onPress: () => {
                this.setState({
                  autoEndQuestion: false
                })
              },
              style: "cancel"
            },
            { text: "Nộp bài thi", onPress: () => {
              this.setState({
                autoEndQuestion: false
              }, () => {
                this.handleEndAllQuestion();
              })
            }}
          ],
          { cancelable: false }
        );      
      } else {
        Alert.alert(
          "Thông báo",
          "Bạn sẵn sàng nộp bài thi để chấm điểm chưa ?",
          [
            {
              text: "Chưa sẵn sàng",
              onPress: () => {
                this.setState({
                  autoEndQuestion: false
                })
              },
              style: "cancel"
            },
            { text: "Chấm điểm", onPress: () => {
              this.setState({
                autoEndQuestion: false
              }, () => {
                this.handleEndAllQuestion();
              })
            }}
          ],
          { cancelable: false }
        );      
      }
    }

    gotoPage(page) {
      const currentTime = new Date().getTime();
      if(currentTime - this.state.lastGotoPageTime > 700) {
        this.setState({currentPage: page, lastGotoPageTime: currentTime})
      } else {
        Alert.alert('Thông báo', 'Bạn thực hiện thao tác quá nhanh , Vui lòng thực hiện chậm lại');
      }
    }

    renderBookMark() {
      const {categoryDetailItem, currentPage, answeredQuestions, showAllAnswers} = this.state;
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
              let backgroundColor = typeof answeredQuestions[index] !== 'undefined' 
                                      && answeredQuestions[index] !== null ? "#1976d2" : "#a4a4a4";
              
              if (showAllAnswers) {
                if (item.answer === answeredQuestions[index]) {
                  backgroundColor = '#43a047';
                } else {
                  backgroundColor = '#f44336';
                }
              }

              if (index === currentPage) {
                backgroundColor = "#f48fb1";
              }
              
              return (
                <View 
                  key={`bookmark-item-${index}`}
                  style={{
                      backgroundColor: backgroundColor,
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
                this.showAlertEndQuestionConfirm()
              }}
            >
              <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name="calendar-account" color="#fff" size={30} style={{textAlign: 'center'}} />
                <Text style={{color: '#fff', fontSize: 18}}>Chấm điểm</Text>
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
      const {categoryDetailItem, currentPage, answeredQuestions} = this.state;
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
            shouldLoadComponent={(index) => {
              const diff = index - currentPage;
              return diff >= -1 && diff <= 1
            }}
            onSelect={index => {
              this.setState({currentPage: index});
            }}
          >
            {
              questions.map((questionItem, questionIndex) => {
                return (
                  <QuestionItemComponent 
                    key={`QuestionItemComponent-${questionIndex}`}
                    questionItem={questionItem}
                    questionIndex={questionIndex}
                    answered={answeredQuestions[questionIndex]}
                    showQuestionAnswer={this.state.showAllAnswers}
                    onAnswerSelected={this.handleQuestionAnswerSelected.bind(this)}
                  />
                )
              })
            }
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