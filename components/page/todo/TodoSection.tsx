import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";

import { useTodos } from "@/store/todo";
import { Todo } from "@/entities";
import uuid from 'react-native-uuid';

import { useReplicache } from "@/context/ReplicacheContext";
import TodoItem from "./TodoItem";
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import TodoModal from "./TodoModal";
import Button from "@/components/atomic/Button";
import useAppState from "@/hooks/useAppState";
import { useEventSourcePoke } from "@/hooks/useEventSourcePoke";

type TodoSectionProps = {
    listID: string;
}

const TodoSection = ({ listID }: TodoSectionProps) => {

    const { replicache } = useReplicache();
    const appStateVisible = useAppState();
    
    const { todos, todoAdaptors } = useTodos(replicache, listID);
    todos?.sort((t1: Todo, t2: Todo) => t1?.sort - t2?.sort);

    const completedTodo = todos.filter(item => item.status === "DONE").length;
    const totalTodo = todos.length

    useEventSourcePoke(`${process.env.EXPO_PUBLIC_API_URL}/api/replicache/poke?channel=list/${listID}`, replicache);

    useEffect(() => {
        if (replicache && appStateVisible === "active") {
            replicache.pull();
        }
    }, [appStateVisible])

    const [showTodoPopup, setShowTodoPopup] = useState(false);

    const handleTodoPopup = () => {
        setShowTodoPopup(prev => !prev);
    }

    const handleSubmit = async (todo: Todo) => {
        try {
            await todoAdaptors.createTodo({
                ...todo,
                listID,
                id: uuid.v4()
            } as Todo);

            handleTodoPopup();
        } catch (err) {
            console.log('Error while creating todo', err);
        }
    }

    const getTodoInputUI = () => {
        return (
            <View>
                {addTodoModalUI()}
            </View>
        )
    }


    const getTodoSectionHeader = () => {
        return (
            <View>
                <View style={styles.todoSectionHeader}>
                    <Text style={styles.todoCompletedHeading}>
                        {
                            totalTodo > 0 ?
                                <>
                                    {completedTodo} / {totalTodo} Completed
                                </> :
                                <>
                                    No Tasks
                                </>
                        }

                    </Text>
                    <Pressable
                        onPress={handleTodoPopup}
                    >
                        <View style={styles.addTodoIcon}>
                            <Entypo name="plus" size={24} color={Colors.light.text} />
                        </View>
                    </Pressable>
                </View>
            </View>
        )
    }


    const addTodoModalUI = () => {
        return (
            <TodoModal
                isVisible={showTodoPopup}
                closeTodoPopup={handleTodoPopup}
                listID={listID}
                context="CREATE"
                onSubmit={handleSubmit}
                clearOnSubmit
            />
        )
    }


    const getTodoLists = () => {
        if (todos.length === 0) {
            return (
                <View>
                    <Text
                        style={styles.emptyTitle}
                    >
                        Create your first todo
                    </Text>
                    <Button
                        text="ADD A TODO"
                        onButtonPress={handleTodoPopup}
                    />
                </View>
            )
        }

        return (
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TodoItem
                        key={`${item.id}`}
                        todo={item}
                    />
                )}
            />
        );
    }


    return (
        <View
            style={styles.container}
        >
            {getTodoSectionHeader()}
            {getTodoLists()}
            {getTodoInputUI()}
        </View>
    );
}

export default TodoSection;

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        minWidth: '100%',
        minHeight: '100%',
        position: 'relative'
    },
    todoTitleInput: {
        fontSize: 28,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    todoDescInput: {
        fontSize: 22,
        fontFamily: 'Rubik400',
        color: Colors.light.text,
    },
    addTodoIcon: {
        backgroundColor: Colors.light.subtleBackground,
        borderRadius: 25,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    todoCompletedHeading: {
        fontSize: 24,
        fontFamily: 'Rubik500',
    },
    todoSectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    addTodoPopupHeading: {
        fontSize: 26,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    addTodoPopup: {
        backgroundColor: Colors.light.background,
        width: '100%',
        height: 'auto',
        padding: 20,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginTop: 'auto'
    },
    addTodoButton: {
        backgroundColor: Colors.light.subtleBackground,
        padding: 10,
        borderRadius: 10,
        width: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addTodoButtonText: {
        fontSize: 18,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    addTodobuttonContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 20
    },
    todoForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 20
    },
    emptyTitle: {
        alignSelf: 'center',
        fontFamily: 'Rubik400',
        marginBottom: 20,
        fontSize: 30,
        marginTop: 100
    }
});
