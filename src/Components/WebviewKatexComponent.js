import React from "react";
import {WebView} from "react-native-webview";
import AutoHeightWebView from 'react-native-autoheight-webview'
import {Dimensions} from "react-native";

export default class WebviewKatexComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: props.html,
            katexWebviewStyles: {
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

        return (
            <AutoHeightWebView
                source={{html: html}}
                automaticallyAdjustContentInsets={false}
                scalesPageToFit={false}
                scrollEnabled={false}
                style={{...this.state.katexWebviewStyles}}
                onMessage={(event) => {
                    // const webviewHeight = Number(event.nativeEvent.data);
                    // this.setState({
                    //     katexWebviewStyles: {
                    //         ...katexWebviewStyles,
                    //         height: webviewHeight
                    //     }
                    // })
                }}
                javaScriptEnabled={true}
            />
        )
    
    }
}
