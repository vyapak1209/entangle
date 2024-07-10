import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import { AntDesign } from '@expo/vector-icons';
import { List, todosByList } from "@/entities";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useReplicache } from "@/context/ReplicacheContext";
import { useSubscribe } from "@/hooks/useSubscribe";
import { getRandomColor } from "@/utils/random-color";


type Props = {
    list: List;
    deleteList: (listID: string) => void
}

const ListItem = ({ list, deleteList }: Props) => {

    const { replicache } = useReplicache();

    const todos = useSubscribe(replicache, async (tx) => todosByList(tx, list.id), { default: [] });

    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.status === "DONE").length;

    const colorRef = useRef(getRandomColor());

    const [showListOptions, setShowListOptions] = useState(false);

    const router = useRouter();

    const handleShowListOptions = () => {
        setShowListOptions(prev => !prev)
    };

    const handleDeleteList = () => {
        deleteList(list.id);
    }

    const handleRouteToList = () => {
        router.push({ pathname: '/(list)/[listID]', params: { listID: list.id } })
    }

    return (
        <View style={{ overflow: 'hidden' }}>
            <Pressable
                onPress={handleRouteToList}
                android_ripple={{ color: Colors.light.subtleBackground, foreground: true }}
                style={{ ...styles.listCard, backgroundColor: colorRef.current, overflow: 'hidden' }}
            >
                <View style={styles.listCardHeader}>
                    <View style={styles.listShareIcon}>
                        <AntDesign name="adduser" size={24} color={Colors.light.text} />
                    </View>
                    <View style={styles.listOptionsDiv}>
                        {
                            showListOptions &&
                            <View style={styles.listOptionsDiv}>
                                <View style={styles.listShareIcon}>
                                    <AntDesign name="edit" size={24} color={Colors.light.text} />
                                </View>
                                <Pressable
                                    onPress={handleDeleteList}
                                >
                                    <View style={styles.listShareIcon}>
                                        <AntDesign name="delete" size={24} color={Colors.light.text} />
                                    </View>
                                </Pressable>
                            </View>
                        }
                        <Pressable onPress={handleShowListOptions}>
                            {
                                showListOptions ?
                                    <Entypo name="cross" size={24} color={Colors.light.text} /> :
                                    <Octicons name="kebab-horizontal" size={24} color={Colors.light.text} />
                            }
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.listActiveTask}>
                    {(totalCount - completedCount) === 0 ? 'No' : (totalCount - completedCount)} Active Tasks
                </Text>
                <Text style={styles.listTitle}>
                    {list.title}
                </Text>
            </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    listCard: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: 'red',
        padding: 20,
        marginVertical: 10
    },
    listTitle: {
        fontSize: 30,
        fontFamily: 'Rubik500',
    },
    listActiveTask: {
        fontSize: 18,
        fontFamily: 'Rubik400',
    },
    listShareIcon: {
        backgroundColor: Colors.light.subtleBackground,
        borderRadius: 25,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listCardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    listOptionsDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    listOptionIcons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default ListItem;