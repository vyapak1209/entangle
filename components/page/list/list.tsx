import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import EventSource from "react-native-sse";

import { useTodos } from "@/store/todo";
import { Replicache } from "replicache";
import { M } from "@/mutators";
import { Todo } from "@/entities";
import { generateUUID } from "@/utils/random-id";

type ListProps = {
    rep: Replicache<M>;
    listID: string;
    handleDelete: (listID: string) => void;
}

export function List({ listID, rep, handleDelete }: ListProps) {

    // Listen for pokes related to just this list.
    useEventSourcePoke(`http://192.168.0.203:8080/api/replicache/poke?channel=list/${listID}`, rep);

    const { todos, todoAdaptors } = useTodos(rep, listID);
    todos?.sort((t1: Todo, t2: Todo) => t1?.sort - t2?.sort);

    const handleNewItem = async () => {
        await todoAdaptors.createTodo({
            id: generateUUID(18),
            listID: listID,
            title: "my todo",
            status: "TODO",
            description: "This is a todo. And I am doing it.",
            priority: "LOW"
        } as Todo);
    };

    return (
        <View>
            <Text>
                ListID in props ------- {listID}
            </Text>
            {
                todos?.length > 0 && todos.map((item, index) => {
                    return (
                        <View key={`${item.id}-${item.title}-${index}`}>
                            <Text>
                                ListID in item ------ {item.listID}
                            </Text>
                            <Text>
                                Item Title ------- {item.title}
                            </Text>
                        </View>
                    )
                })
            }
            <Pressable
                onPress={handleNewItem}
            >
                <Text style={{ margin: 20, fontWeight: 'bold', color: 'red' }}>
                    Add Todo
                </Text>
            </Pressable>
            <Pressable
                onPress={() => handleDelete(listID)}
            >
                <Text>
                    Delete List
                </Text>
            </Pressable>
        </View>
    );
}

function useEventSourcePoke(url: string, rep: Replicache<M>) {
    useEffect(() => {
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
    separator: {
        width: "100%",
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#e6e6e6",
    },
    footerContainer: {
        padding: 8,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#d9d9d9",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    footerText: {
        color: "#111111",
        fontSize: 15,
        lineHeight: 19,
    },
});
