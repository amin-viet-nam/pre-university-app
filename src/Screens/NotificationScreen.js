import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ItemSeparatorView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import firebase from '../../src/DataStorages/FirebaseApp';
import AutoHeightWebView from "react-native-autoheight-webview";

const styles = {
    container: {
        justifyContent: 'center',
        flex: 1,
        padding: 4
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#c94f7c',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
    itemStyle: {
        marginTop: 20
    }
};


export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                id: -1,
                title: 'Cảm ơn bạn đã tải ứng dụng Amin luyện thi THPT',
                content: `Amin là một trong những ứng dụng luyện thi THPT Quốc Gia tại Việt Nam.<br><br> Nền tảng miễn phí này cho phép học sinh tự trao dồi kiến thức của mình dựa trên bộ sưu tập những câu hỏi trắc nghiệm từ nhiều nguồn dữ liệu khác nhau .<br><br> Amin luyện thi THPT giúp bạn dễ dàng đạt được kết quả tốt trong kỳ thi THPT sắp tới .<br><br>Với kho đề thi phong phú, tất cả đều có đáp án, lời giải chi tiết. Được cập nhật liên tục và chọn lọc từ các trường và thầy cô trên cả nước. <br>Kho tài liệu đầy đủ phục vụ các bạn Luyện thi mọi lúc mọi nơi. <br>Ứng dụng đơn giản, dễ sử dụng. <br>Đầy đủ các môn và phần thi có trắc nghiệm <br>Chế độ thi thật với thời gian thực và bài thi sẽ được tự động chấm điểm sau khi nộp bài. <br><br> Bộ câu hỏi quý giá này đều do các thầy cô giáo luyện thi nổi tiếng trực tiếp biên soạn, có nội dung bám sát theo chương trình thi TNPTQG hiện hành, cực kỳ đầy đủ và chi tiết.`,
                reverseDate: 0
            }],
            loading: true,
            size: 2,
            startAt: null
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const {startAt, size, dataSource} = this.state;
        const user = firebase.auth().currentUser;

        let newDataSource = dataSource.filter(m => m.id === -1);

        const ref = firebase.database().ref(`publicNotifications`)
            .orderByChild('reverseDate')
            .limitToLast(10);

        if (startAt !== null) {
            ref.startAt(startAt)
        }

        ref.once('value', snapshot => {
            this.setState({loading: false})
            const data = snapshot.val();
            if (data) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = data[key];
                        newDataSource.push(element);
                    }
                }
                const newStartAt = newDataSource[newDataSource.length - 1].reverseDate;
                newDataSource.sort((a, b) => a.reverseDate - b.reverseDate);
                this.setState({
                    dataSource: newDataSource,
                    startAt: newStartAt
                })
            }
        });
    }

    renderFooterLoadMore() {
        // const {loading, dataSource, size} = this.state;
        //
        // if (dataSource.length < size) {
        //     return <View style={{justifyContent: 'center', alignItems: 'center'}}>
        //         <Text>...</Text>
        //     </View>
        // }
        //
        // return (
        //     //Footer View with Load More button
        //     <View style={styles.footer}>
        //         <TouchableOpacity
        //             activeOpacity={0.9}
        //             onPress={() => {
        //                 this.setState({
        //                     loading: true
        //                 }, () => {
        //                     this.loadData()
        //                 })
        //             }}
        //             //On Click of button load more data
        //             style={styles.loadMoreBtn}>
        //             <Text style={styles.btnText}>Load More</Text>
        //             {loading ? (
        //                 <ActivityIndicator
        //                     color="white"
        //                     style={{marginLeft: 8}}/>
        //             ) : null}
        //         </TouchableOpacity>
        //     </View>
        // );
        return (<View/>);
    };

    render() {
        const {dataSource, loading, size} = this.state;

        return (
            <SafeAreaView style={{flex: 1, padding: 4, backgroundColor: '#fafafa'}}>
                <View style={styles.container}>
                    <FlatList
                        data={dataSource}
                        keyExtractor={(item, index) => `notification-sc-index-${index}`}
                        ItemSeparatorComponent={ItemSeparatorView}
                        enableEmptySections={true}
                        renderItem={(data) => {
                            const item = data.item;
                            return (
                                <View style={styles.itemStyle}>
                                    <Text style={{fontSize: 20}}>{item.title}</Text>

                                    <AutoHeightWebView
                                        source={{html: item.content}}
                                        automaticallyAdjustContentInsets={false}
                                        scalesPageToFit={false}
                                        scrollEnabled={false}
                                        style={{backgroundColor: 'rgba(255,255,255,0)', width: Dimensions.width}}
                                        javaScriptEnabled={true}
                                    />
                                    <View
                                        style={{
                                            marginTop: 4,
                                            borderBottomColor: '#cacaca',
                                            borderBottomWidth: 1,
                                        }}
                                    />
                                </View>
                            )
                        }}
                        ListFooterComponent={() => {
                            return this.renderFooterLoadMore();
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}