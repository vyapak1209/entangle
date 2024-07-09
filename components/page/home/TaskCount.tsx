import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useReplicache } from '@/context/ReplicacheContext'
import { useTodoCount } from '@/store/todo-count';
import { Colors } from '@/constants/Colors';

const TaskCount = () => {

    const { replicache } = useReplicache();

    const { completedCount, totalCount } = useTodoCount(replicache)

    return (
        <View style={styles.statDiv}>
            <Text style={styles.statPercentage}>
                {completedCount} / {totalCount}
            </Text>
            <Text style={styles.statLabel}>
                Completed Tasks
            </Text>
        </View>
    )
}

export default TaskCount;

const styles = StyleSheet.create({
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
})