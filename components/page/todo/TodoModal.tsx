import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

import Modal from 'react-native-modal';
import Switcher from '@/components/atomic/Switcher';
import Button from '@/components/atomic/Button';
import { Priority } from '@/constants/enums';
import { Todo, TodoUpdate } from '@/entities';
import { Colors } from '@/constants/Colors';

type TodoModalProps = {
    isVisible: boolean;
    onSubmit: (todo: Todo) => void;
    listID: string;
    closeTodoPopup: () => void;
    overrideState?: Todo;
    context: "CREATE" | "UPDATE";
    clearOnSubmit: boolean;
}

const initialTodoState = {
    title: '',
    listID: '',
    id: '',
    description: '',
    status: 'TODO',
    priority: 'LOW'
}

const TodoModal = ({ isVisible, onSubmit, listID, closeTodoPopup, overrideState, context, clearOnSubmit = true }: TodoModalProps) => {

    const [editTodo, setEditTodo] = useState<TodoUpdate>({
        ...initialTodoState,
        ...overrideState
    } as Todo);

    const fieldsEmpty = editTodo.title?.length as number < 3 || editTodo.description?.length as number < 3;

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


    const handlePriorityInput = (val: string) => {
        setEditTodo(prev => {
            return {
                ...prev,
                priority: val as Priority
            }
        })
    }

    const handleSubmit = () => {
        if (!fieldsEmpty) {
            onSubmit(editTodo as Todo);
            if (clearOnSubmit) {
                setEditTodo(initialTodoState as Todo);
            }
        }
    }

    return (
        <View>
            <Modal
                isVisible={isVisible}
                avoidKeyboard={true}
                onBackButtonPress={closeTodoPopup}
                onBackdropPress={closeTodoPopup}
                useNativeDriver
                style={{
                    margin: 0,
                }}
            >
                <View style={styles.addTodoPopup}>
                    <View style={styles.todoForm}>
                        <TextInput
                            editable
                            value={editTodo.title}
                            onChangeText={handleTodoTitleInput}
                            onSubmitEditing={handleSubmit}
                            style={styles.todoTitleInput}
                            placeholder="Create a todo"
                            placeholderTextColor={Colors.light.placeholder}
                            autoFocus
                        />
                        <TextInput
                            editable
                            value={editTodo.description}
                            onChangeText={handleTodoDescriptionInput}
                            onSubmitEditing={handleSubmit}
                            style={styles.todoDescInput}
                            placeholder="Add description"
                            placeholderTextColor={Colors.light.placeholder}
                        />
                    </View>
                    <View style={styles.addTodobuttonContainer}>
                        <Switcher
                            onSelect={handlePriorityInput}
                            selected={editTodo.priority as Priority}
                            choices={[
                                { title: 'LOW', value: 'LOW' },
                                { title: 'MEDIUM', value: 'MEDIUM' },
                                { title: 'HIGH', value: 'HIGH' },
                            ]}
                        />
                        <Button
                            text="ADD"
                            ripple
                            onButtonPress={handleSubmit}
                            disabled={fieldsEmpty}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default TodoModal

const styles = StyleSheet.create({
    todoTitleInput: {
        fontSize: 28,
        fontFamily: 'Rubik500',
        color: Colors.light.text,
        width: '100%'
    },
    todoDescInput: {
        fontSize: 22,
        fontFamily: 'Rubik400',
        color: Colors.light.text,
        width: '100%'
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
})