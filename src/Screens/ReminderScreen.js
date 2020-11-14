import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Text, View, Dimensions } from 'react-native';
import { Card } from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import NavigatorService from '../../src/Services/NavigatorService';
import DateTimePicker from '@react-native-community/datetimepicker';


export default class ReminderScreen extends React.Component {
    constructor(props) {
        super(props);
        let dateInWeekLabels = [
            { index: 0, text: 'Mọi thứ Hai', },
            { index: 1, text: 'Mọi thứ Ba' },
            { index: 2, text: 'Mọi thứ Tư' },
            { index: 3, text: 'Mọi thứ Năm' },
            { index: 4, text: 'Mọi thứ Sáu' },
            { index: 5, text: 'Mọi thứ Bảy' },
            { index: 6, text: 'Mọi Chủ Nhật' },
        ];
        dateInWeekLabels[0].checked = true;
        dateInWeekLabels[3].checked = true;
        this.state = {
            dateInWeekLabels,
            reminderTime : new Date(1598051730000)
        }
    }

    render() {
        const { dateInWeekLabels, reminderTime } = this.state;
        const deviceWidth = Dimensions.get("window").width;

        return (
            <SafeAreaView style={{ flex: 1, padding: 4, backgroundColor: '#fafafa' }}>
                <View style={{ padding: 4, }}>
                    <Text style={{ fontSize: 20 }}>Nhắc tôi học bài vào:</Text>
                </View>
                <FlatList
                    style={{
                        flexGrow: 0
                    }}
                    scrollEnabled={false}
                    data={dateInWeekLabels}
                    numColumns={1}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            margin: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ripple style={{ padding: 0 }} onPress={() => {
                                dateInWeekLabels[index].checked = !dateInWeekLabels[index].checked;
                                this.setState({
                                    dateInWeekLabels: dateInWeekLabels
                                })
                            }}>
                                <Card
                                    style={{
                                        width: deviceWidth * 2 / 3,
                                        margin: 2,
                                        backgroundColor: 'white',
                                        borderRadius: 4,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2, },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {
                                            item.checked &&
                                            <MaterialCommunityIcons name="check" size={20}
                                                style={{ textAlign: 'center' }}
                                            />
                                        }
                                        <Text style={{ fontSize: 16, textAlign: 'center', marginLeft: 4 }}>
                                            {item.text}
                                        </Text>
                                    </View>
                                </Card>
                            </Ripple>
                        </View>
                    )}
                />
                <View style={{ padding: 4 }}>
                    <Text style={{ fontSize: 20 }}>Lúc :</Text>
                </View>
                <View>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={reminderTime}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            this.setState({
                                reminderTime: selectedDate
                            })
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}