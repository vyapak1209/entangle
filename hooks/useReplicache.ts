import { TODO_MUTATORS, USER_MUTATORS } from "@/mutators";
import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import React from "react";
import EventSource from "react-native-sse";
import { Replicache } from "replicache";

export function useReplicache(listID: string) {
  const licenseKey = 'l19880c269c0d4620a24b3a05218559c3';
  if (!licenseKey) {
    throw new Error("Missing VITE_REPLICACHE_LICENSE_KEY");
  }

  const r = React.useMemo(
    () => {
      if (listID) {
        return new Replicache({
          licenseKey,
          pushURL: `http://192.168.0.203:3000/api/replicache/push?spaceID=${listID}`,
          pullURL: `http://192.168.0.203:3000/api/replicache/pull?spaceID=${listID}`,
          experimentalCreateKVStore:
            createReplicacheExpoSQLiteExperimentalCreateKVStore,
          name: listID,
          auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          mutators: {
            ...TODO_MUTATORS,
            ...USER_MUTATORS
          },
        })
      }
    },
    [listID],
  );

  React.useEffect(() => {
    const ev = new EventSource(
      `http://192.168.0.203:3000/api/replicache/poke?spaceID=${listID}`,
      {
        headers: {
          withCredentials: true,
        },
      },
    );

    ev.addEventListener("message", async (evt) => {
      if (evt.type !== "message") return;
      if (evt.data === "poke") {
        r?.pull();
      }
    });

    return () => {
      ev.close();
    };
  }, [listID]);

  return r;
}
