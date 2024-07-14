import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Replicache } from 'replicache';
import { createReplicacheExpoSQLiteExperimentalCreateKVStore } from "@react-native-replicache/react-native-expo-sqlite";
import { M, mutators } from "@/mutators";
import { useUser } from '@/store/user';

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

  const { user } = useUser();

  useEffect(() => {
    const spaceID = user?.userID;

    if (!spaceID) {
      return;
    }

    console.log('Creating Replicache instance for', spaceID);

    const r = new Replicache({
      name: spaceID,
      licenseKey: process.env.EXPO_PUBLIC_REPLICACHE_KEY as string,
      mutators,
      experimentalCreateKVStore: createReplicacheExpoSQLiteExperimentalCreateKVStore,
      pushURL: `${process.env.EXPO_PUBLIC_API_URL}/api/replicache/push?userID=${spaceID}`,
      pullURL: `${process.env.EXPO_PUBLIC_API_URL}/api/replicache/pull?userID=${spaceID}`
    });

    setReplicache(r);

    r.onSync = (syncState) => {
      console.log('Replicache sync state:', syncState);
    };

    return () => {
      void r.close();
    };
  }, [ user ]);

  return (
    <ReplicacheContext.Provider value={{ replicache }}>
      {children}
    </ReplicacheContext.Provider>
  );
};