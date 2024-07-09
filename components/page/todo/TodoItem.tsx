import React, { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import { AntDesign } from '@expo/vector-icons';
import { Todo } from "@/entities";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CollapsableContainer } from "@/components/custom/CollapsableContainer";


type Props = {
    todo: Todo;
    deleteTodo: (id: string) => void;
}

const COLORS = [Colors.light.purple, Colors.light.teal, Colors.light.yellow];

const TodoItem = ({ todo, deleteTodo }: Props) => {

    const randomIndex = Math.floor(Math.random() * (COLORS.length));

    const colorIndexRef = useRef(randomIndex);

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

    const handleTodoClick = () => {
        handleTodoExpand();
    }

    const additionalDetailsUI = () => {
        return (
            <CollapsableContainer expanded={expanded}>
                <View style={styles.todoDescContainer}>
                    <Text style={styles.todoDescription}>
                        {todo.description}
                    </Text>
                </View>
            </CollapsableContainer>
        )
    }


    return (
        <Pressable onPress={handleTodoClick}>
            <View
                style={{
                    ...styles.todoCard,
                    backgroundColor: COLORS[colorIndexRef.current]
                }}>
                <View style={styles.todoCardHeader}>
                    <View style={styles.todoStatusIcon}>
                        {
                            todo.status === 'DONE' ?
                                <AntDesign name="check" size={24} color={Colors.light.text} /> :
                                null
                        }
                    </View>
                    <View style={styles.todoOptionsDiv}>
                        <Animated.View style={[styles.todoOptionIcons, animatedOpacityStyle]}>
                            <View style={styles.todoStatusIcon}>
                                <AntDesign name="edit" size={24} color={Colors.light.text} />
                            </View>
                            <Pressable onPress={() => deleteTodo(todo.id)}>
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
                <View style={styles.todoCardTitle}>
                    <Text style={styles.todoTitle}>
                        {todo.title}
                    </Text>
                </View>
                {additionalDetailsUI()}
            </View>
        </Pressable>
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
        fontSize: 24,
        fontFamily: 'Rubik500',
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
        gap: 10
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
        fontSize: 18,
        fontFamily: 'Rubik400'
    },
    todoDescContainer: {
        marginTop: 10
    }
});

export default TodoItem;