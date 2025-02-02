import ListHeader from '@/components/page/list/ListHeader';
import TodoSection from '@/components/page/todo/TodoSection';
import { Colors } from '@/constants/Colors';
import { useSelectedList } from '@/store/list';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, FlatList } from 'react-native';


export default function List() {

    const { listID } = useLocalSearchParams();

    const selectedList = useSelectedList(listID as string);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View>
                <ListHeader
                    list={selectedList}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[{}]}
                    renderItem={() => <>
                        <TodoSection
                            listID={listID as string}
                        />
                    </>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: Colors.light.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        height: '100%',
        width: '100%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background
    },
    text: {
        color: 'white',
    }
});