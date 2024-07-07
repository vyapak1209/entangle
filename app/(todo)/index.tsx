import { TodoList } from "@/components/todo-list";
import { useUser } from "@/hooks/useUser";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const HomeScreen = () => {

  const [ username, setUsername ] = useState<string | null>(null);
  const [ draftUsername, setDraftUsername ] = useState("");

  const { loading, error, spaceID } = useUser(username);

  const renderUsernameInput = () => {
    return (
      <TextInput
        editable
        value={draftUsername}
        onChangeText={(text) => setDraftUsername(text)}
        onSubmitEditing={() => setUsername(draftUsername)}
        placeholder="Enter User Name"
      />
    )
  }

  const renderUI = () => {
    if (loading) {
      return <ActivityIndicator size="large" />
    }

    if (error) {
      return (
        <Text>
          Ooops!
        </Text>
      )
    }

    if (spaceID) {
      return <TodoList spaceID={spaceID} listId="" />
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>todos</Text>
      <View
        style={{ flex: 1, alignItems: "stretch", justifyContent: "center" }}
      >
        {renderUsernameInput()}
        {renderUI()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "stretch",
  },
  title: {
    fontSize: 80,
    fontWeight: "200",
    textAlign: "center",
    color: "#b83f45",
  },
});

export default HomeScreen;