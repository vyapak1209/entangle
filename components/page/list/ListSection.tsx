import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Entypo } from '@expo/vector-icons';

import EventSource from "react-native-sse";

import { useLists } from "@/store/list";

import Modal from "react-native-modal";

import { Replicache } from "replicache";
import { M } from "@/mutators";
import { generateUUID } from "@/utils/random-id";
import ListItem from "./ListItem";
import { useReplicache } from "@/context/ReplicacheContext";
import { Colors } from "@/constants/Colors";

type ListSectionProps = {
    userID: string;
}

export function ListSection({ userID }: ListSectionProps) {

    const [listName, setListName] = useState('');
    const [showListNamePopup, setShowListNamePopup] = useState(false);

    const { replicache } = useReplicache();

    // Listen for pokes related to the docs this user has access to.
    useEventSourcePoke(`http://192.168.0.203:8080/api/replicache/poke?channel=user/${userID}`, replicache);

    const { lists, listAdaptors } = useLists(replicache);
    lists?.sort((a, b) => a?.title?.localeCompare(b?.title));

    const handleNewList = async () => {

        if (String(listName).length === 0) {
            return;
        }

        const id = generateUUID(36);

        try {
            await listAdaptors.createList({
                id,
                ownerID: userID,
                title: listName,
            });

            handleListNamePopup();
        } catch (err) {
            console.log('error while creating', err)
        }
    };


    const handleDeleteList = async (listID: string) => {
        try {
            await listAdaptors.deleteList(listID);
        } catch (err) {
            console.log('error while deleting', err)
        }
    }


    const handleListNamePopup = () => {
        setShowListNamePopup(prev => !prev)
    }


    const getAllLists = () => {
        return (
            <View>
                {
                    lists?.length > 0 && lists.map((item, index) => {
                        return (
                            <ListItem
                                key={item.id + item.ownerID + index}
                                list={item}
                                deleteList={handleDeleteList}
                            />
                        )
                    })
                }
            </View>
        )
    }


    const listSectionHeaderUI = () => {
        return (
            <View style={styles.listSectionHeader}>
                <Text style={styles.allListsHeading}>
                    All Lists
                </Text>
                <Pressable
                    onPress={handleListNamePopup}
                >
                    <View style={styles.addListIcon}>
                        <Entypo name="plus" size={24} color={Colors.light.text} />
                    </View>
                </Pressable>
            </View>
        )
    }


    const addListModalUI = () => {
        return (
            <View>
                <Modal
                    isVisible={showListNamePopup}
                    avoidKeyboard={true}
                    onBackButtonPress={handleListNamePopup}
                    onBackdropPress={handleListNamePopup}
                    useNativeDriver
                    style={{
                        margin: 0,
                    }}
                >
                    <View style={styles.addListPopup}>
                        <Text
                            style={styles.addListPopupHeading}
                        >
                            Add a list
                        </Text>

                        <View>
                            <TextInput
                                editable
                                value={listName}
                                onChangeText={setListName}
                                onSubmitEditing={handleNewList}
                                style={styles.listNameInput}
                                placeholder="List name"
                                placeholderTextColor={Colors.light.placeholder}
                            />
                        </View>
                        <View style={styles.addListbuttonContainer}>
                        <TouchableOpacity
                            onPress={handleNewList}
                        >
                            <View
                                style={styles.addListButton}
                            >
                                <Text style={styles.addListButtonText}>
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
        <View>
            <View style={styles.listSection}>
                {listSectionHeaderUI()}
                {getAllLists()}
            </View>
            {addListModalUI()}
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

const styles = StyleSheet.create({
    listSection: {
        marginTop: 40
    },
    allListsHeading: {
        fontSize: 30,
        fontFamily: 'Rubik600',
    },
    addListIcon: {
        backgroundColor: Colors.light.subtleBackground,
        borderRadius: 25,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listSectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    addListPopupHeading: {
        fontSize: 26,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    addListPopup: {
        backgroundColor: Colors.light.background,
        width: '100%',
        height: 'auto',
        padding: 20,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        marginTop: 'auto'
    },
    listNameInput: {
        marginTop: 20,
        fontSize: 45,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    addListButton: {
        backgroundColor: Colors.light.subtleBackground,
        padding: 10,
        borderRadius: 10,
        width: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addListButtonText: {
        fontSize: 18,
        fontFamily: 'Rubik500',
        color: Colors.light.text
    },
    addListbuttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        marginTop: 20
    }
});
