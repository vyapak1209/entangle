import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useReplicache } from '@/context/ReplicacheContext'
import { Colors } from '@/constants/Colors';
import { allTodos } from '@/entities';
import { useSubscribe } from '@/hooks/useSubscribe';

const TaskCount = () => {

    const { replicache } = useReplicache();

    const todos = useSubscribe(replicache, allTodos, { default: [] });

    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.status === "DONE").length;

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