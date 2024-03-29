import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Layout, Radio, RadioGroup} from '@ui-kitten/components';
import katex from 'katex';
import AnswerItemComponent from './AnswerItemComponent';
import WebviewKatexComponent from './WebviewKatexComponent';
import katexStyle from '../../library/katex/katex-style';
import AdmobUtils from "../Utils/AdmobUtils";
import {AdMobRewarded} from "expo-ads-admob";

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

    componentDidMount() {
        console.log(AdmobUtils);
        AdmobUtils.shouldShowInterstitialAds(900)
            .then(async (ok) => {
                if (ok) {
                    await AdMobRewarded.setAdUnitID(AdmobUtils.interstitialAds);
                    await AdMobRewarded.requestAdAsync();
                    await AdMobRewarded.showAdAsync();
                }
            })
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    katexStringReplace(str) {
        if (str === null || typeof str === 'undefined') {
            return null;
        }

        str = str.replace(/(\\\([^]*?\\\))/g, function (m, bracket) {
            if (bracket !== undefined) {
                return katex.renderToString(m.replace(/\\\(|\$\$|\\\)/g, ""), {
                    throwOnError: false,
                    strict: 'ignore'
                });
            }
            return m;
        });

        return `<!DOCTYPE html> 
                    <html> 
                    <head> 
                        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                        <style>
                        body { font-size: 120%; word-wrap: break-word; overflow-wrap: break-word; }
                        ${katexStyle}
                        </style>
                    </head> 
                    <body> ${str} </body> 
                    </html>`;
    }

    render() {
        const {questionItem, questionIndex, answered} = this.state;
        const {showQuestionAnswer, useKatexHtmlInject} = this.props;
        const externalImagePath = 'https://storage.googleapis.com/amin-2020/image';
        if (!questionItem) {
            return <Text>questionItem and questionIndex are required</Text>
        }

        let ask = questionItem.ask.replace(/\\n/g, '<br>');
        let solutionGuide = questionItem.solutionGuide;

        let hasSolutionImage = questionItem.hasSolutionImage;
        let hasQuestionImage = questionItem.hasQuestionImage;
        const deviceWidth = Dimensions.get("window").width;

        if (useKatexHtmlInject) {
            ask = this.katexStringReplace(questionItem.ask);
            solutionGuide = this.katexStringReplace(questionItem.solutionGuide);
        }

        return (
            <Layout key={`viewpage-item-${questionIndex}`} style={{flex: 1, backgroundColor: '#fafafa', margin: 4}}>
                <ScrollView style={{flex: 1}}>
                    <WebviewKatexComponent
                        html={ask}
                        useKatexHtmlInject={useKatexHtmlInject}
                    />
                    {
                        hasQuestionImage &&
                        <Image
                            ref={(ref) => {
                                this._questionImageRef = ref;
                            }}
                            style={{width: deviceWidth, height: 200}}
                            resizeMode="contain"
                            onError={e => {
                                this._questionImageRef.setNativeProps({style: {display: 'none'}})
                            }}
                            source={{uri: `${externalImagePath}/${questionItem.id}-question.png`}}/>
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
                    {
                        showQuestionAnswer && solutionGuide &&
                        <View>
                            <Text style={{fontSize: 25}}>Hướng dẫn giải</Text>
                            <WebviewKatexComponent
                                html={solutionGuide}
                                useKatexHtmlInject={useKatexHtmlInject}
                            />
                        </View>
                    }
                    {
                        showQuestionAnswer && hasSolutionImage &&
                        <Image
                            ref={(ref) => {
                                this._answerImageRef = ref;
                            }}
                            style={{width: deviceWidth, height: 200}}
                            resizeMode="contain"
                            onError={e => {
                                this._answerImageRef.setNativeProps({style: {display: 'none'}})
                            }}
                            source={{uri: `${externalImagePath}/${questionItem.id}-solution.png`}}/>
                    }
                </ScrollView>
            </Layout>
        )
    }
}