import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

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

type TodoSectionProps = {
    listID: string;
}

const initialTodoState = {
    title: '',
    listID: '',
    id: generateUUID(16),
    description: '',
    status: 'TODO',
    priority: 'LOW'
}

const TodoSection = ({ listID }: TodoSectionProps) => {

    const { replicache } = useReplicache();
    const { todos, todoAdaptors } = useTodos(replicache, listID);
    todos?.sort((t1: Todo, t2: Todo) => t1?.sort - t2?.sort);

    useEventSourcePoke(`http://192.168.0.203:8080/api/replicache/poke?channel=list/${listID}`, replicache);

    const [showTodoPopup, setShowTodoPopup] = useState(false)
    const [editTodo, setEditTodo] = useState<TodoUpdate>({
        ...initialTodoState,
        listID
    } as Todo);


    const handleTodoPopup = () => {
        setShowTodoPopup(prev => !prev);
    }

    const handleTodoTitleInput = (text: string) => {
        setEditTodo(prev => {
            return {
                ...prev,
                title: text
            }
        })
    }

    const handleTodoDescriptionInput = (text: string) => {
        setEditTodo(prev => {
            return {
                ...prev,
                description: text
            }
        })
    }

    const handleInputSubmit = (key: "title" | "description") => {
        console.log(key)
    }

    const handleSubmit = async () => {
        try {
            await todoAdaptors.createTodo(editTodo as Todo);


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
                        4/12 Completed
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
            <View>
                <Modal
                    isVisible={showTodoPopup}
                    avoidKeyboard={true}
                    onBackButtonPress={handleTodoPopup}
                    onBackdropPress={handleTodoPopup}
                    useNativeDriver
                    style={{
                        margin: 0,
                    }}
                >
                    <View style={styles.addTodoPopup}>
                        <View>
                            <TextInput
                                editable
                                value={editTodo.title}
                                onChangeText={handleTodoTitleInput}
                                onSubmitEditing={() => handleInputSubmit("title")}
                                style={styles.todoTitleInput}
                                placeholder="Create a todo"
                                placeholderTextColor={Colors.light.placeholder}
                            />
                            <TextInput
                                editable
                                value={editTodo.description}
                                onChangeText={handleTodoDescriptionInput}
                                onSubmitEditing={() => handleInputSubmit("description")}
                                style={styles.todoDescInput}
                                placeholder="Add description"
                                placeholderTextColor={Colors.light.placeholder}
                            />
                        </View>
                        <View style={styles.addTodobuttonContainer}>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={editTodo.title?.length ? editTodo.title?.length < 3 : true}
                            >
                                <View
                                    style={styles.addTodoButton}
                                >
                                    <Text style={styles.addTodoButtonText}>
                                        ADD
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
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
                                deleteTodo={handleTodoDelete}
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
        marginTop: 20
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
        alignItems: 'flex-end',
        marginTop: 20
    }
});
