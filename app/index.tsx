import { ListSection } from "@/components/page/list-section";
import { TodoList } from "@/components/page/todo-list";
import { useUser } from "@/hooks/useUser";
import { M, mutators } from "@/mutators";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Replicache } from 'replicache'

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import { Link } from "expo-router";
import { useReplicache } from "@/context/ReplicacheContext";
import { Colors } from "@/constants/Colors";

const App = () => {
  const { replicache } = useReplicache();

  const renderUI = () => {
    if (replicache) {
      return (
        <Link
          href='/home'
          style={styles.title}
        >
          Take me home
        </Link>
      )
    } else {
      return (
        <Text>
          Setting up replicache...
        </Text>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View>
          <View>
            {renderUI()}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    alignItems: "center",
    height: '100%'
  },
  title: {
    fontSize: 36,
    fontWeight: "200",
    textAlign: "center",
    color: Colors.light.text,
    fontFamily: 'Rubik500'
  },
});

export default App;