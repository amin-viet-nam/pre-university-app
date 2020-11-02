import {Dimensions, Text, View} from "react-native";
import {WebView} from "react-native-webview";
import HTML from "react-native-render-html";
import React from "react";


export default class AnswerItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            evaProps: props.evaProps,
            choiceIndex: props.choiceIndex,
            choice: props.choice,
            useKatexHtmlInject: props.useKatexHtmlInject,
            choiceWebviewStyles: {
                height: props.defaultHeight || 0,
                backgroundColor: 'rgba(255,255,255,0)'
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    render() {
        const {evaProps, choiceIndex, choice, useKatexHtmlInject, choiceWebviewStyles} = this.state;

        return (
            <View {...evaProps} style={{
                ...evaProps.style,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Text style={{fontSize: 19}}>
                    {(() => {
                        switch (choiceIndex) {
                            case 0:
                                return <Text>A. </Text>
                            case 1:
                                return <Text>B. </Text>
                            case 2:
                                return <Text>C. </Text>
                            case 3:
                                return <Text>D. </Text>
                            default:
                                return <Text>{choiceIndex + 1} Đáp án khác . </Text>
                        }
                    })()}
                </Text>
                <View style={{marginLeft: 2, flex: 1}}>
                    {useKatexHtmlInject ?
                        <WebView
                            source={{html: choice}}
                            automaticallyAdjustContentInsets={false}
                            scrollEnabled={false}
                            scalesPageToFit={false}
                            onMessage={(event) => {
                                const webviewHeight = Number(event.nativeEvent.data);
                                if (choiceWebviewStyles.height !== webviewHeight) {
                                    this.setState({
                                        choiceWebviewStyles: {
                                            ...this.state.choiceWebviewStyles,
                                            height: webviewHeight
                                        }
                                    })
                                }
                            }}
                            javaScriptEnabled={true}
                            style={{...choiceWebviewStyles, opacity: choiceWebviewStyles.height !== 0 ? 1: 0}}
                        />
                        :
                        <HTML
                            baseFontStyle={{fontSize: 19}}
                            html={choice}
                            imagesMaxWidth={Dimensions.get("window").width}
                        />
                    }
                </View>
            </View>
        )
    }
}
