import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Text, View, Dimensions, Platform } from 'react-native';
import { Card } from '@ui-kitten/components';
import Ripple from 'react-native-material-ripple';
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import NavigatorService from '../../src/Services/NavigatorService';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class ReminderScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayInWeekLabels: [
                { id: 1, text: 'Mọi thứ Hai', },
                { id: 2, text: 'Mọi thứ Ba' },
                { id: 3, text: 'Mọi thứ Tư' },
                { id: 4, text: 'Mọi thứ Năm' },
                { id: 5, text: 'Mọi thứ Sáu' },
                { id: 6, text: 'Mọi thứ Bảy' },
                { id: 0, text: 'Mọi Chủ Nhật' },
            ],
            reminderTime: 0
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('user_reminder')
            .then((rawData) => {
                if (rawData !== null) {
                    const savedData = JSON.parse(rawData);
                    const { selectedDayInWeek, reminderTime } = savedData;

                    const { dayInWeekLabels } = this.state;

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
        const quotes = [
            `“80% của sự thành công là biết xuất hiện đúng thời điểm” – Woody Allen`,
            `“Nếu bạn quan sát kỹ, bạn sẽ thấy rằng thành công qua đêm cũng cần một thời gian rất dài” – Steve Jobs`,
            `“Thành công giống như chính bản thân bạn, giống như việc bạn làm và giống như cách bạn làm nó” – Maya Angelou`,
            `“Thành công là một giáo viên tồi. Nó làm người thông minh nghĩ rằng họ không thể thất bại” – Bill Gates`,
            `“Định nghĩa thành công theo cách riêng của bạn, vươn tới nó bằng những nguyên tắc riêng và xây dựng một cuộc sống mà bạn cảm thấy tự hào” – Anne Sweeney`,
            `“Chúng ta phải bằng lòng với sự thất vọng thoáng chốc, nhưng tuyệt đối đừng bao giờ đánh mất niềm hy vọng vô biên” – Martin Luther King Jr.`,
            `“Sự khác biệt giữa những người thành công và những người thực sự thành công đó là những người thực sự thành công nói không với hầu như tất cả mọi thứ” – Warren Buffett`,
            `“Đừng giới hạn bản thân. Nhiều người tự giới hạn mình trong những gì họ nghĩ họ có thể làm. Bạn có thể tiến xa như bạn nghĩ. Bạn tin vào điều gì, bạn sẽ có thể đạt được” – Mary Kay Ash`,
            `“Trước khi làm bất cứ điều gì, chuẩn bị là chìa khóa để thành công” – Alexander Graham Bell`,
            `“Cuộc sống quá ngắn ngủi để nghĩ về những gì đã qua” – Hillary Clinton`,
            `Cuộc đời chúng ta sẽ dần kết thúc từ cái ngày mà ta trở nên câm lặng với những vấn đề quan trọng” – Martin Luther King Jr.`,
            `“Thành công là kết quả của sự rèn luyện đến thành thạo, làm việc chăm chỉ, học hỏi từ thất bại, trung thành và kiên trì” – Colin Powell`,
            `“Thất bại là thành công nếu chúng ta học hỏi từ nó” – Malcolm Forbes`,
            `“Câu hỏi không phải là ai sẽ cho phép; mà là ai sẽ ngăn cản tôi” – Ayn Rand`,
            `“Cách trả thù tốt nhất là thành công vượt bậc” – Frank Sinatra`,
            `“Thành công là té ngã 9 lần và đứng lên ở lần thứ 10” – Jon Bon Jovi`,
            `“Sự khác biệt giữa một người thành công và những người khác không phải là thiếu sức mạnh, không phải là thiếu kiến thức mà là thiếu ý chí” – Vince Lombardi`,
            `“Mỗi người đều có thể vượt lên hoàn cảnh của mình và đạt được thành công nếu họ tận tâm và đam mê những gì họ làm” – Nelson Mandela`,
            `“Cách để bắt đầu là ngừng nói và bắt tay vào làm” – Walt Disney`,
            `“Đừng xấu hổ vì thất bại của bạn, học hỏi từ chúng và bắt đầu lại một lần nữa” – Richard Branson`,
            `“Thành công của bạn được đánh giá bằng những gì bạn phải từ bỏ để đạt được nó” – Đạt Lai Lạt Ma thứ 14`,
            `“Bạn mất 100% cơ hội nếu bạn không thực hiện” – Wayne Gretzky`,
            `“Luôn nhớ rằng niềm tin kiên định vào thành công quan trọng hơn bất cứ điều gì khác” – Abraham Lincoln`,
            `Bạn phải học biết quy luật của trò chơi. Và khi đó bạn phải chơi trò chơi đó tốt hơn bất cứ ai khác. Albert Einstein.`,
            `Just do it`,
            `Sau mỗi khó khăn, hãy tự hỏi bản thân 2 câu hỏi, đó là ‘Mình đã làm đúng điều gì?’ và ‘Mình làm sẽ làm điều gì khác?’- Brian Tracy.`,
            `Thành công thường đến với những người bận rộn tìm kiếm nó.- Henry David Thoreau.`,
            `Bắt đầu từ nơi bạn đang đứng. Sử dụng những gì bạn có. Làm cái bạn có thể làm.- Arthur Ashe.`,
            `Thành công dường như luôn kết nối với hành động. Người thành công thì luôn hành động. Họ làm sai, nhưng họ không từ bỏ.- Conrad Hilton.`,
            `Sự khác biệt giữa người thành công và những người khác không phải là thiếu sự mạnh hay kiến thức, mà là thiếu ý chí. Vince Lombardi.`,
            `Thành công là việc tích góp từ những cố gắng nổ lực nhỏ được lặp lại mỗi ngày.- Robert Collier.`
        ];

        const { dayInWeekLabels, reminderTime } = this.state;

        const selectedDayInWeek = dayInWeekLabels.filter(f => f.checked === true)
            .map(m => m.id);

        const updatedReminder = {
            selectedDayInWeek,
            reminderTime
        };

        AsyncStorage.setItem('user_reminder', JSON.stringify(updatedReminder))
            .then(() => {
                const lastMonday = moment().startOf('week');
                const hour = moment(reminderTime).add(1, 'hour').get('hour');
                const minute = moment(reminderTime).get('minute');

                Notifications.cancelAllScheduledNotificationsAsync()
                    .then(() => {
                        for (let i = 0; i < selectedDayInWeek.length; i++) {
                            for (let j = 1; j < 12; j++) {
                                const dayInWeek = selectedDayInWeek[i];

                                const nextScheduled = moment(lastMonday).day(dayInWeek + (7 * j));
                                nextScheduled.set({ hour: hour, minute: minute, second: 0, millisecond: 0 });

                                const notifyAfter = nextScheduled.diff(moment(), 'seconds');

                                const quoteText = quotes[Math.floor(Math.random() * quotes.length)];
                                Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: "Amin luyện thi",
                                        body: `Amin nhắc bạn học bài. Trích dẫn cho bạn: ${quoteText}.`
                                    },
                                    trigger: {
                                        seconds: notifyAfter
                                    }
                                });
                            }
                        }
                    });
            });
    }

    render() {
        const { dayInWeekLabels, reminderTime } = this.state;
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
                    data={dayInWeekLabels}
                    numColumns={1}
                    keyExtractor={(item, index) => `reminder-sc-item-${index}`}
                    renderItem={({ item, index }) => (
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            margin: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ripple style={{ padding: 0 }} onPress={() => {
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
                        value={new Date(reminderTime)}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {                            
                            this.setState({
                                reminderTime: selectedDate.getTime()
                            }, () => {
                                this.updateAndSaveReminderData();
                            })
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}