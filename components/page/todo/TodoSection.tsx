import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import EventSource from "react-native-sse";

import { useTodos } from "@/store/todo";
import { Replicache } from "replicache";
import { M } from "@/mutators";
import { Todo, TodoUpdate } from "@/entities";
import { generateUUID } from "@/utils/random-id";
import { useReplicache } from "@/context/ReplicacheContext";
import TodoItem from "./TodoItem";
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import TodoModal from "./TodoModal";

type TodoSectionProps = {
    listID: string;
}

const initialTodoState = {
    title: '',
    listID: '',
    id: '',
    description: '',
    status: 'TODO',
    priority: 'LOW'
}

const TodoSection = ({ listID }: TodoSectionProps) => {

    const { replicache } = useReplicache();
    const { todos, todoAdaptors } = useTodos(replicache, listID);
    todos?.sort((t1: Todo, t2: Todo) => t1?.sort - t2?.sort);

    const completedTodo = todos.filter(item => item.status === "DONE").length;
    const totalTodo = todos.length

    useEventSourcePoke(`http://192.168.0.101:8080/api/replicache/poke?channel=list/${listID}`, replicache);

    const [showTodoPopup, setShowTodoPopup] = useState(false);

    const handleTodoPopup = () => {
        setShowTodoPopup(prev => !prev);
    }

    const handleSubmit = async (todo: Todo) => {
        try {
            await todoAdaptors.createTodo({
                ...todo,
                listID,
                id: generateUUID(16)
            } as Todo);

            handleTodoPopup();
        } catch (err) {
            console.log('Error while creating todo', err);
        }
    }

    const handleTodoDelete = async (id: string) => {
        try {
            await todoAdaptors.deleteTodo(id);
        } catch (err) {
            console.log('Error while deleting todo', err);
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


    return (
        <View
            style={styles.container}
        >
            {getTodoSectionHeader()}
            <View>
                {
                    todos?.length > 0 && todos.map((item, index) => {
                        return (
                            <TodoItem
                                key={`${item.id}`}
                                todo={item}
                            />
                        )
                    })
                }
            </View>
            {getTodoInputUI()}
        </View>
    );
}

function useEventSourcePoke(url: string, rep: Replicache<M> | null) {
    useEffect(() => {

        if (!rep) {
            return
        }

        const ev = new EventSource(url);
        ev.addEventListener("message", async (evt) => {
            if (evt.type !== "message") return;
            if (evt.data === "poke") {
                rep?.pull();
            }
        });
        return () => ev.close();
    }, [url, rep]);
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
    }
});
