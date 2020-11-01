import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import HTML from "react-native-render-html";
import { ScrollView } from 'react-native-gesture-handler';
import { Layout, Radio, RadioGroup } from '@ui-kitten/components';
import katex from 'katex';

export default class QuestionItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useKatexHtmlInject: props.useKatexHtmlInject,
            questionItem: props.questionItem,
            questionIndex: props.questionIndex,
            answered: props.answered,
            onAnswerSelected: props.onAnswerSelected,
        }
    }

    katexStringReplace(str) {
      const katexRegex = /\\\((.*?)\\\)/g;
      const katexMatch = katexRegex.exec(str);
      if (katexMatch) {
        for (var i = 1; i < katexMatch.length; i++) {
          const katexHtml = katex.renderToString(katexMatch[i], {
              throwOnError: false,
              strict: 'ignore'
          });
          str = str.replace('\\(' + katexMatch[i] + '\\)', katexHtml);
        }
      }
      return str;    
    }

    render() {
        const {questionItem, questionIndex} = this.state;
        const {showQuestionAnswer, useKatexHtmlInject} = this.props;
        if(!questionItem) {
            return <Text>questionItem and questionIndex are required</Text>
        }

        const answered = this.state.answered;

        let ask = questionItem.ask;
        if (useKatexHtmlInject) {
          ask = this.katexStringReplace(questionItem.ask);
        }

        return (
          <Layout key={`viewpage-item-${questionIndex}`}  style={{flex: 1,  backgroundColor: '#fafafa', margin: 4}}>
            <ScrollView style={{flex: 1}}>

              {useKatexHtmlInject ? 
                <HTML
                  baseFontStyle={{fontSize: 20}}
                  html={ask}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
                : 
                <HTML
                  baseFontStyle={{fontSize: 20}}
                  html={ask}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
              }
              <View>
                <RadioGroup 
                  selectedIndex={showQuestionAnswer ? questionItem.answer : answered}
                  onChange={selectedAnswerIndex => {
                    this.setState({
                        answered: selectedAnswerIndex
                    }, () => {
                        setTimeout(() => {
                            if (this.state.onAnswerSelected) {
                                this.state.onAnswerSelected(questionItem, questionIndex, selectedAnswerIndex);
                            }
                        }, 60)
                    })
                  }}
                >
                  {questionItem.choices && questionItem.choices.map((choice, choiceIndex) => {

                    let htmlChoice = choice;
                    if (useKatexHtmlInject) {
                      htmlChoice = this.katexStringReplace(choice);
                    }

                    let backgroundColor = '';
                    if (showQuestionAnswer) {
                        if (questionItem.answer === choiceIndex) {
                            backgroundColor = '#43a047';
                        } else if(answered === choiceIndex){
                            backgroundColor = '#f44336';
                        }
                    }

                    return (
                      <Radio key={`question-choice-${questionItem.id}-${choiceIndex}`} disabled={showQuestionAnswer} style={{backgroundColor: backgroundColor, padding: 2}}>
                        {evaProps => {
                          return (
                            <View {...evaProps} style={{...evaProps.style, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                              <Text style={{fontSize: 19}}>
                                {(() => {
                                  switch(choiceIndex) {
                                    case 0:
                                      return <Text>A. </Text>
                                    case 1:
                                      return <Text>B. </Text>
                                    case 2:
                                      return <Text>C. </Text>
                                    case 3:
                                      return <Text>D. </Text>
                                    default:
                                      return <Text>{choiceIndex + 1} Đáp án khác  . </Text> 
                                  }
                                })()}
                              </Text>
                              <View style={{marginLeft: 2}}>
                                {useKatexHtmlInject ? 
                                <HTML
                                  baseFontStyle={{fontSize: 19}}
                                  html={htmlChoice}
                                  imagesMaxWidth={Dimensions.get("window").width}
                                />
                                :
                                <HTML
                                  baseFontStyle={{fontSize: 19}}
                                  html={htmlChoice}
                                  imagesMaxWidth={Dimensions.get("window").width}
                                />
                                }
                              </View>
                            </View>
                          )
                        }}
                      </Radio>
                    )
                  })}
                </RadioGroup>                      
              </View>
            </ScrollView>
          </Layout>
        )
    }
}