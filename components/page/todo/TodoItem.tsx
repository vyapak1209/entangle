import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign } from '@expo/vector-icons';
import { Todo, TodoUpdate } from "@/entities";
import { Colors } from "@/constants/Colors";
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CollapsableContainer } from "@/components/custom/CollapsableContainer";
import { getRandomColor } from "@/utils/random-color";
import TodoModal from "./TodoModal";
import { useReplicache } from "@/context/ReplicacheContext";
import { useTodos } from "@/store/todo";

import IconButton from "@/components/atomic/IconButton";
// import SlideToDelete from "@/components/custom/SlideToDelete";


type Props = {
    todo: Todo;
}

const TodoItem = ({ todo }: Props) => {

    const colorRef = useRef(getRandomColor());

    const { replicache } = useReplicache();
    const { todoAdaptors } = useTodos(replicache, todo.listID);

    const [showEditPopup, setShowEditPopup] = useState(false)
    const [expanded, setExpanded] = useState(false);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0);


    const handleTodoExpand = () => {
        setExpanded(prev => !prev);
        rotation.value = expanded ? withTiming(0) : withTiming(180);
        opacity.value = expanded ? withTiming(0) : withTiming(1);
    }

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }]
        };
    });

    const animatedOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        };
    });


    const onEditTodoSubmit = async (todo: TodoUpdate) => {
        try {
            await todoAdaptors.updateTodo(todo);
            handleTodoPopup();
        } catch (err) {
            console.log('Error while updating todo', err);
        }
    }


    const onTodoStatusChange = async () => {
        const newStatus = todo.status === "DONE" ? "TODO" : "DONE"
        try {
            await todoAdaptors.updateTodo({ ...todo, status: newStatus });
        } catch (err) {
            console.log('Error while updating todo', err);
        }
    }


    const handleTodoDelete = async (force?: boolean) => {

        if (!expanded && !force) {
            handleTodoExpand();
            return;
        }

        try {
            await todoAdaptors.deleteTodo(todo.id);
        } catch (err) {
            console.log('Error while deleting todo', err);
        }
    }


    const handleTodoPopup = () => {

        if (!expanded) {
            handleTodoExpand();
            return;
        }

        setShowEditPopup(prev => !prev);
    }

    const handleTodoClick = () => {
        handleTodoExpand();
    }


    const additionalDetailsUI = () => {
        return (
            <CollapsableContainer expanded={expanded}>
                <View style={styles.todoCardTitle}>
                    <Text style={styles.todoTitle}>
                        {todo.title}
                    </Text>
                </View>
                <View style={styles.todoDescContainer}>
                    <Text style={styles.todoDescription}>
                        {todo.description}
                    </Text>
                </View>
            </CollapsableContainer>
        )
    }


    const getTodoHeaderUI = () => {

        const isDone = todo.status === 'DONE'

        return (
            <View style={styles.todoCardHeader}>
                <View style={styles.todoHeaderTitle}>
                    <IconButton
                        onPressHandle={onTodoStatusChange}
                        size={40}
                    >
                        <View>
                            {
                                isDone ?
                                    <AntDesign name="check" size={20} color={Colors.light.text} /> :
                                    null
                            }
                        </View>
                    </IconButton>
                    {
                        !expanded &&
                        <Animated.View style={[styles.todoCardTitleTop]} entering={FadeIn} exiting={FadeOut}>
                            <Text style={[styles.todoTitle, isDone ? styles.titleLineThrough : {}]}>
                                {todo.title}
                            </Text>
                        </Animated.View>
                    }
                </View>
                <View style={styles.todoOptionsDiv}>
                    <Animated.View style={[styles.todoOptionIcons, animatedOpacityStyle]}>
                        <Pressable onPress={handleTodoPopup}>
                            <View style={styles.todoStatusIcon}>
                                <AntDesign name="edit" size={24} color={Colors.light.text} />
                            </View>
                        </Pressable>
                        <Pressable onPress={() => handleTodoDelete(false)}>
                            <View style={styles.todoStatusIcon}>
                                <AntDesign name="delete" size={24} color={Colors.light.text} />
                            </View>
                        </Pressable>
                    </Animated.View>
                    <Animated.View
                        style={animatedIconStyle}
                    >
                        <Entypo name="chevron-down" size={24} color={Colors.light.text} />
                    </Animated.View>
                </View>
            </View>
        )
    }


    return (
        // <SlideToDelete
        //     onDelete={() => handleTodoDelete(true)}
        // >
        <Animated.View entering={FadeInDown}>
            <Pressable onPress={handleTodoClick}>
                <View
                    style={{
                        ...styles.todoCard,
                        backgroundColor: colorRef.current
                    }}>
                    {getTodoHeaderUI()}
                    {additionalDetailsUI()}
                </View>
                <TodoModal
                    isVisible={showEditPopup}
                    closeTodoPopup={handleTodoPopup}
                    listID={todo.listID}
                    context="UPDATE"
                    onSubmit={onEditTodoSubmit}
                    overrideState={todo}
                    clearOnSubmit={false}
                />
            </Pressable>
        </Animated.View>
        // </SlideToDelete>
    );
};


const styles = StyleSheet.create({
    todoCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginVertical: 6
    },
    todoTitle: {
        fontSize: 22,
        fontFamily: 'Rubik500',
        width: '80%'
    },
    todoStatusIcon: {
        backgroundColor: Colors.light.subtleBackground,
        borderRadius: 20,
        height: 40,
        width: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    todoCardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    todoOptionsDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        position: 'absolute',
        right: 5
    },
    todoOptionIcons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    todoCardTitle: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginTop: 20
    },
    todoDescription: {
        fontSize: 20,
        fontFamily: 'Rubik400'
    },
    todoDescContainer: {
        marginTop: 10
    },
    todoHeaderTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    todoCardTitleTop: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    titleLineThrough: {
        textDecorationLine: 'line-through'
    }
});

export default TodoItem;