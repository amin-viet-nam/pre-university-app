import React from "react";
import {WebView} from "react-native-webview";
import HTML from "react-native-render-html";
import {Dimensions} from "react-native";

export default class WebviewKatexComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: props.html,
            katexWebviewStyles: {
                height: 50,
                backgroundColor: 'rgba(255,255,255,0)',
                ...this.props.katexWebviewStyles,
            },
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    render() {
        const {html, katexWebviewStyles} = this.state;
        const {useKatexHtmlInject} = this.props;

        if (useKatexHtmlInject) {
            return (
                <WebView
                    source={{html: html}}
                    automaticallyAdjustContentInsets={false}
                    scalesPageToFit={false}
                    scrollEnabled={false}
                    style={{...this.state.katexWebviewStyles}}
                    onMessage={(event) => {
                        const webviewHeight = Number(event.nativeEvent.data);
                        this.setState({
                            katexWebviewStyles: {
                                ...katexWebviewStyles,
                                height: webviewHeight
                            }
                        })
                    }}
                    javaScriptEnabled={true}
                />
            )
        }
        return (
            <HTML
                baseFontStyle={{fontSize: 20}}
                html={html}
                imagesMaxWidth={Dimensions.get("window").width}
            />
        )
    }
}
