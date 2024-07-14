import IconButton from '@/components/atomic/IconButton';
import TaskCount from '@/components/page/home/TaskCount';
import { ListSection } from '@/components/page/list/ListSection';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/store/user';
import { getDayOfWeek, getFormattedDate } from '@/utils/date';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';

import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomeScreen = () => {

    const { user } = useUser();

    const router = useRouter();

    const onSwitchClick = () => {
        router.push('/')
    }

    const getTopSectionUI = () => {
        return (
            <View style={styles.greetingDiv}>
                <Text style={styles.greeting}>
                    Hello,
                </Text>
                <View style={styles.usernameContainer}>
                    <Text style={styles.username}>
                        {user?.username}
                    </Text>
                    <IconButton onPressHandle={onSwitchClick}>
                        <Octicons name="arrow-switch" size={24} color={Colors.light.text} />
                    </IconButton>
                </View>
            </View>
        )
    }


    const getStatusSectionUI = () => {
        return (
            <View style={styles.statusDiv}>
                <View>
                    <Text style={styles.dayIndicator}>
                        Today's {getDayOfWeek(new Date())}
                    </Text>
                    <Text style={styles.dateIndicator}>
                        {getFormattedDate(new Date())}
                    </Text>
                </View>
                <TaskCount />
            </View>
        )
    }


    const getListSectionUI = () => {
        return (
            <ListSection />
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
            <View>
                {getTopSectionUI()}
                {getStatusSectionUI()}
                {getListSectionUI()}
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: Colors.light.background,
        padding: 20, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: '100%',
        width: '100%'
    },
    greeting: {
        fontSize: 50,
        color: Colors.light.text,
        fontFamily: 'Rubik400'
    },
    username: {
        fontSize: 55,
        color: Colors.light.text,
        fontFamily: 'Rubik500',
        lineHeight: 70
    },
    dayIndicator: {
        fontSize: 24,
        color: Colors.light.text,
        fontFamily: 'Rubik500'
    },
    dateIndicator: {
        fontSize: 20,
        color: Colors.light.text,
        fontFamily: 'Rubik500',
        opacity: 0.6
    },
    statPercentage: {
        fontSize: 24,
        color: Colors.light.text,
        fontFamily: 'Rubik500'
    },
    statLabel: {
        fontSize: 20,
        color: Colors.light.text,
        fontFamily: 'Rubik500',
        textAlign: 'right',
        opacity: 0.6
    },
    statDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    statusDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right',
        width: '100%',
        marginTop: 30
    },
    greetingDiv: {
        marginTop: 20
    },
    usernameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default HomeScreen;