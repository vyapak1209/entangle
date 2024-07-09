import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import { AntDesign } from '@expo/vector-icons';
import { List } from "@/entities";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";


type Props = {
    list: List;
    deleteList: (listID: string) => void
}

const COLORS = [Colors.light.purple, Colors.light.teal, Colors.light.yellow];

const ListItem = ({ list, deleteList }: Props) => {

    const randomIndex = Math.floor(Math.random() * (COLORS.length));

    const colorIndexRef = useRef(randomIndex);

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
        <Pressable onPress={handleRouteToList}>
            <View style={{ ...styles.listCard, backgroundColor: COLORS[colorIndexRef.current] }}>
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
                    2 Active Tasks
                </Text>
                <Text style={styles.listTitle}>
                    {list.title}
                </Text>
            </View>
        </Pressable>
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