import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { TodoInput } from "./todo-input";
import { TodoItem } from "./todo-item";
import { useReplicache } from "@/hooks/useReplicache";
import { Todo, TodoUpdate, listTodos } from "@/entities/todo";
import { Subscribable, useSubscribe } from "@/hooks/useSubscribe";
import { randomUUID } from "expo-crypto";

interface TodoListProps {
  spaceID: string;
  listId: string;
}

export function TodoList({ spaceID, listId }: TodoListProps) {
  const rep = useReplicache(spaceID);

  const todos = useSubscribe(rep as any, listTodos, { default: [], dependencies: [ rep ] });
  todos?.sort((t1: Todo, t2: Todo) => t1.sort - t2.sort);

  const handleNewItem = (text: string) => {
    rep?.mutate.createTodo({
      id: randomUUID(),
      listId: listId,
      title: text,
      priority: 'LOW',
      status: 'TODO',
    });
  };

  const handleUpdateTodo = (update: TodoUpdate) =>
    rep?.mutate.updateTodoStatus(update);

  const handleDeleteTodos = async (ids: string[]) => {
    for (const id of ids) {
      await rep?.mutate.deleteTodo(id);
    }
  };

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          handleDelete={() => handleDeleteTodos([item.id])}
          handleUpdate={(update) =>
            handleUpdateTodo({ id: item.id, ...update })
          }
        />
      )}
      ListHeaderComponent={<TodoInput handleSubmit={handleNewItem} />}
      ListFooterComponent={
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>List: {spaceID}</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 32 }}
    />
  );
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
