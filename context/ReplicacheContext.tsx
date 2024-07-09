import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Replicache } from 'replicache';
import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import { M, mutators } from "@/mutators";

interface ReplicacheContextType {
  replicache: Replicache<M> | null;
}

const ReplicacheContext = createContext<ReplicacheContextType | undefined>(undefined);

export const useReplicache = (): ReplicacheContextType => {
  const context = useContext(ReplicacheContext);
  if (context === undefined) {
    throw new Error('useReplicache must be used within a ReplicacheProvider');
  }
  return context;
};

export const ReplicacheProvider = ({ children }: { children: ReactNode }) => {
  const [replicache, setReplicache] = useState<Replicache<M> | null>(null);

  useEffect(() => {
    const spaceID = 'hayt65';

    if (!spaceID) {
      return;
    }
    console.log('updating replicache');
    const r = new Replicache({
      name: spaceID,
      licenseKey: 'l19880c269c0d4620a24b3a05218559c3',
      mutators,
      experimentalCreateKVStore: createReplicacheExpoSQLiteExperimentalCreateKVStore,
      pushURL: `http://192.168.0.203:8080/api/replicache/push?userID=${spaceID}`,
      pullURL: `http://192.168.0.203:8080/api/replicache/pull?userID=${spaceID}`,
    });
    setReplicache(r);
    return () => {
      void r.close();
    };
  }, []);

  return (
    <ReplicacheContext.Provider value={{ replicache }}>
      {children}
    </ReplicacheContext.Provider>
  );
};