import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ItemSeparatorView } from 'react-native';
import firebase from '../../src/DataStorages/FirebaseApp';

const styles = StyleSheet.create({
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
});


export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                id: -1,
                title: 'Cảm ơn bạn đã tải ứng dụng Amin luyện thi THPT',
                content: 'Cảm ơn bạn đã tải ứng dụng Amin luyện thi THPT',
                date: -(new Date().getTime())
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
        const { startAt, size, dataSource } = this.state;
        const user = firebase.auth().currentUser;

        let newDataSource = dataSource.filter(m => m.id === -1);

        const ref = firebase.database().ref(`publicNotifications`)
            .orderByChild('reverseDate')
            .limitToLast(2);

        if (startAt !== null) {
            ref.startAt(startAt)
        }

        ref.once('value', snapshot => {
            this.setState({ loading: false })
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
        const { loading, dataSource, size } = this.state;

        if (dataSource.length < size) {
            return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>...</Text>
            </View>
        }

        return (
            //Footer View with Load More button
            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this.setState({
                            loading: true
                        }, () => {
                            this.loadData()
                        })
                    }}
                    //On Click of button load more data
                    style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>Load More</Text>
                    {loading ? (
                        <ActivityIndicator
                            color="white"
                            style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { dataSource, loading, size } = this.state;

        return (
            <SafeAreaView style={{ flex: 1, padding: 4, backgroundColor: '#fafafa' }}>
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
                                    <Text style={{ fontSize: 20 }}>{item.title}</Text>
                                    <Text>{item.content}</Text>
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