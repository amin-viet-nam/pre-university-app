import {Text, View} from "react-native";
import React from "react";
import WebviewKatexComponent from "./WebviewKatexComponent";


export default class AnswerItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            evaProps: props.evaProps,
            choiceIndex: props.choiceIndex,
            choice: props.choice,
            useKatexHtmlInject: props.useKatexHtmlInject,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }

    render() {
        const {evaProps, choiceIndex, choice, useKatexHtmlInject} = this.state;

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
                    <WebviewKatexComponent
                        html={choice}
                        useKatexHtmlInject={useKatexHtmlInject}
                    />
                </View>
            </View>
        )
    }
}
