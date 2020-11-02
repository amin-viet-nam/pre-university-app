import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import HTML from "react-native-render-html";
import {ScrollView} from 'react-native-gesture-handler';
import {Layout, Radio, RadioGroup} from '@ui-kitten/components';
import katex from 'katex';
import {WebView} from 'react-native-webview';
import AnswerItemComponent from './AnswerItemComponent';
import katexStyle from '../../library/katex/katex-style';

export default class QuestionItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useKatexHtmlInject: props.useKatexHtmlInject,
            questionItem: props.questionItem,
            questionIndex: props.questionIndex,
            answered: props.answered,
            onAnswerSelected: props.onAnswerSelected,
            askWebviewStyles: {
                height: 50,
                backgroundColor: 'rgba(255,255,255,0)'
            },
            isAllKatexComponentLoaded: true
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
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
        return `<!DOCTYPE html> 
                    <html> 
                    <head> 
                        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                        <style> ${katexStyle.default} </style> 
                        <style>
                        </style>
                    </head> 
                    <body> ${str} </body> 
                    <script>
                      function post () {
                        window.ReactNativeWebView.postMessage(
                          Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)
                        );
                      }
                      var tid = setInterval( function () {
                             if ( document.readyState !== 'complete' ) return;
                             clearInterval( tid );       
                             setTimeout(post, 1);
                      }, 50 );
                    </script>
                    </html>`;
    }

    render() {
        const {questionItem, questionIndex} = this.state;
        const {showQuestionAnswer, useKatexHtmlInject} = this.props;
        if (!questionItem) {
            return <Text>questionItem and questionIndex are required</Text>
        }

        const answered = this.state.answered;

        let ask = questionItem.ask.replaceAll('\\n', '<br>');
        if (useKatexHtmlInject) {
            ask = this.katexStringReplace(questionItem.ask);
        }

        return (
            <Layout key={`viewpage-item-${questionIndex}`} style={{flex: 1, backgroundColor: '#fafafa', margin: 4}}>
                <ScrollView style={{flex: 1}}>
                    {useKatexHtmlInject ?
                        <WebView
                            source={{html: ask}}
                            automaticallyAdjustContentInsets={false}
                            scalesPageToFit={false}
                            scrollEnabled={false}
                            style={{...this.state.askWebviewStyles}}
                            onMessage={(event) => {
                                const webviewHeight = Number(event.nativeEvent.data);
                                this.setState({
                                    askWebviewStyles: {
                                        ...this.state.askWebviewStyles,
                                        height: webviewHeight
                                    }
                                })
                            }}
                            javaScriptEnabled={true}
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
                                });

                                if (this.state.onAnswerSelected) {
                                    this.state.onAnswerSelected(questionItem, questionIndex, selectedAnswerIndex);
                                }
                            }}
                            style={{opacity: !useKatexHtmlInject || this.state.isAllKatexComponentLoaded ? 1 : 0}}
                        >
                            {questionItem.choices && questionItem.choices.map((originChoice, choiceIndex) => {
                                let choice = originChoice.replace('\\n', '<br>');
                                if (useKatexHtmlInject) {
                                    choice = this.katexStringReplace(originChoice);
                                }

                                let backgroundColor = '';
                                if (showQuestionAnswer) {
                                    if (questionItem.answer === choiceIndex) {
                                        backgroundColor = '#43a047';
                                    } else if (answered === choiceIndex) {
                                        backgroundColor = '#f44336';
                                    }
                                }

                                return (
                                    <Radio key={`question-choice-${questionItem.id}-${choiceIndex}`}
                                           disabled={showQuestionAnswer}
                                           style={{backgroundColor: backgroundColor, padding: 2}}>
                                        {evaProps => {
                                            return (
                                                <AnswerItemComponent
                                                    evaProps={evaProps}
                                                    choiceIndex={choiceIndex}
                                                    choice={choice}
                                                    useKatexHtmlInject={useKatexHtmlInject}
                                                />
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