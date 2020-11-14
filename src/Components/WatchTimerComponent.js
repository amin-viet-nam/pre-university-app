import React from "react";
import { Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 7200;

const getTimeSeconds = time => (minuteSeconds - time / 1000) | 0;
const getTimeMinutes = time => ((time % hourSeconds) / minuteSeconds) | 0;

export default class WatchTimerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: Date.now() / 1000,
            endTime: this.props.endTime || (Date.now() / 1000) + 100
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps)
            || JSON.stringify(this.state) !== JSON.stringify(nextState);
    }


    renderTime(dimension, time) {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{ fontSize: 11 }}>{time}</Text>
                <Text style={{ fontSize: 11 }}>{dimension}</Text>
            </View>
        );
    };

    render() {
        const {startTime, endTime} = this.state;
        const remainingTime = endTime - startTime;
        
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4
            }}>
                <View>
                    <CountdownCircleTimer
                        colors={[
                            ['#f8bbd0', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                          ]}
                        duration={hourSeconds}
                        initialRemainingTime={remainingTime % hourSeconds}
                        onComplete={totalElapsedTime => [remainingTime - totalElapsedTime > minuteSeconds]}
                        isPlaying={true}
                        size={45}
                        strokeWidth={3}
                    >
                        {({ elapsedTime }) =>
                            this.renderTime(
                                "phút",
                                getTimeMinutes(hourSeconds - elapsedTime / 1000)
                            )
                        }
                    </CountdownCircleTimer>
                </View>
                <View style={{ marginLeft: 4 }}>
                    <CountdownCircleTimer
                        colors={[
                            ['#f8bbd0', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                          ]}
                        duration={minuteSeconds}
                        initialRemainingTime={remainingTime % minuteSeconds}
                        onComplete={totalElapsedTime => {
                            const shouldContinue = remainingTime - totalElapsedTime > 0;
                            if(shouldContinue === false && typeof this.props.timeUp === 'function') {
                                this.props.timeUp();
                            }
                            return [shouldContinue]
                        }}
                        isPlaying={true}
                        size={45}
                        strokeWidth={3}
                    >
                        {({ elapsedTime }) =>
                            this.renderTime("giây", getTimeSeconds(elapsedTime))
                        }
                    </CountdownCircleTimer>
                </View>
            </View>
        )
    }
}
