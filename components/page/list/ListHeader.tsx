import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { List } from "@/entities";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import ListShareButton from "./ListShareButton";


type Props = {
    list: List;
}

const ListHeader = ({ list }: Props) => {

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    }

    return (
        <View style={styles.headerContainer}>
            <Pressable
                onPress={handleGoBack}
            >
                <View style={styles.headerLeftContainer}>
                    <Ionicons name="arrow-back" size={36} color={Colors.light.text} />
                </View>
            </Pressable>
            <View>
                <Text style={styles.listTitle}>
                    {list.title}
                </Text>
            </View>
            <ListShareButton
                showCollaborators={false}
                listID={list.id}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    headerLeftContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    headerContainer: {
        width: '100%',
        paddingVertical: 20,
        position: 'absolute',
        top: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
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
    listTitle: {
        fontSize: 26,
        fontFamily: 'Rubik500'
    }
});

export default ListHeader;