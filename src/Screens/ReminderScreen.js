import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, FlatList, Text, View, Button} from 'react-native';
import {Card} from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import {MaterialCommunityIcons} from 'react-native-vector-icons';
import NotificationUtils from "../Utils/NotificationUtils";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export default class ReminderScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayInWeekLabels: [
                {id: 1, text: 'Mọi thứ Hai',},
                {id: 2, text: 'Mọi thứ Ba'},
                {id: 3, text: 'Mọi thứ Tư'},
                {id: 4, text: 'Mọi thứ Năm'},
                {id: 5, text: 'Mọi thứ Sáu'},
                {id: 6, text: 'Mọi thứ Bảy'},
                {id: 0, text: 'Mọi Chủ Nhật'},
            ],
            reminderTime: 0,
            showTimePickerAndroid: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('user_reminder')
            .then((rawData) => {
                if (rawData !== null) {
                    const savedData = JSON.parse(rawData);
                    const {selectedDayInWeek, reminderTime} = savedData;

                    const {dayInWeekLabels} = this.state;

                    for (let i = 0; i < dayInWeekLabels.length; i++) {
                        const element = dayInWeekLabels[i];
                        if (selectedDayInWeek.includes(element.id)) {
                            dayInWeekLabels[i].checked = true
                        }
                    }

                    this.setState({
                        dayInWeekLabels,
                        reminderTime
                    })
                }
            })

    }

    updateAndSaveReminderData() {
        const {dayInWeekLabels, reminderTime} = this.state;

        const selectedDayInWeek = dayInWeekLabels.filter(f => f.checked === true)
            .map(m => m.id);

        NotificationUtils.SaveAndUpdateReminderData(selectedDayInWeek, reminderTime);
    }

    render() {
        const {dayInWeekLabels, reminderTime, showTimePickerAndroid} = this.state;
        const deviceWidth = Dimensions.get("window").width;

        return (
            <SafeAreaView style={{flex: 1, padding: 4, backgroundColor: '#fafafa'}}>
                <View style={{padding: 4,}}>
                    <Text style={{fontSize: 20}}>Nhắc tôi học bài vào:</Text>
                </View>
                <FlatList
                    style={{
                        flexGrow: 0
                    }}
                    scrollEnabled={false}
                    data={dayInWeekLabels}
                    numColumns={1}
                    keyExtractor={(item, index) => `reminder-sc-item-${index}`}
                    renderItem={({item, index}) => (
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            margin: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ripple style={{padding: 0}} onPress={() => {
                                dayInWeekLabels[index].checked = !dayInWeekLabels[index].checked;
                                this.setState({
                                    dayInWeekLabels: dayInWeekLabels
                                }, () => {
                                    this.updateAndSaveReminderData();
                                })
                            }}>
                                <Card
                                    style={{
                                        width: deviceWidth * 2 / 3,
                                        margin: 2,
                                        backgroundColor: 'white',
                                        borderRadius: 4,
                                        shadowColor: "#000",
                                        shadowOffset: {width: 0, height: 2,},
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        {
                                            item.checked &&
                                            <MaterialCommunityIcons name="check" size={20}
                                                                    style={{textAlign: 'center'}}
                                            />
                                        }
                                        <Text style={{fontSize: 16, textAlign: 'center', marginLeft: 4}}>
                                            {item.text}
                                        </Text>
                                    </View>
                                </Card>
                            </Ripple>
                        </View>
                    )}
                />
                <View style={{padding: 4}}>
                    <Text style={{fontSize: 20}}>Lúc :</Text>
                    <Button onPress={() => {
                        this.setState({
                            showTimePickerAndroid: true
                        });
                    }} title="Chọn giờ" />
                </View>
                {
                    (Platform.OS === 'ios' || showTimePickerAndroid) &&
                    <View>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(reminderTime)}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    this.setState({
                                        reminderTime: selectedDate.getTime(),
                                        showTimePickerAndroid: false
                                    }, () => {
                                        this.updateAndSaveReminderData();
                                    })
                                }
                            }}
                        />
                    </View>
                }
                
            </SafeAreaView>
        );
    }
}