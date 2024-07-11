import { create } from 'zustand';
import { List } from "@/entities";
import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';

type ListState = {
  lists: List[];
  selectedList: List;
  setSelectedList: (listID: string) => void;
  initialiseReplicacheSubscription: (replicache: Replicache<M>) => () => void;
};

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  selectedList: {} as List,
  setSelectedList: (listID: string) => {
    const selectedList = get().lists.filter(item => item.id === listID);
    set({ selectedList: selectedList?.[0] ?? {} });
  },
  initialiseReplicacheSubscription: (replicache: Replicache<M>) => {
    const unsubscribe = replicache.subscribe(
      async (tx) => {
        try {
          const lists = (await tx.scan({ prefix: 'list/' }).values().toArray()) as List[];
          return lists;
        } catch (err) {
          console.error('Error in Replicache transaction:', err);
          return [];
        }
      },
      {
        onData: (lists) => {
          set({ lists });
        },
        onError: (error) => {
          console.error('Error in Replicache subscription:', error);
        },
      }
    );
    return () => {
      unsubscribe();
    };
  },
}));

export const useLists = (rep: Replicache<M> | null) => {
  const { lists, initialiseReplicacheSubscription } = useListStore();

  useEffect(() => {
    if (rep) {
      const unsubscribe = initialiseReplicacheSubscription(rep);
      return () => {
        unsubscribe();
      };
    }
  }, [rep]);

  const createList = async (list: List) => {
    try {
      await rep?.mutate?.createList(list);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await rep?.mutate?.deleteList(listId);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return { lists, listAdaptors: { createList, deleteList } };
};

export const useSelectedList = (listID: string | undefined) => {
  const { selectedList, setSelectedList } = useListStore();

  useEffect(() => {
    if (listID) {
      setSelectedList(listID);
    }
  }, [listID]);

  return selectedList;
};
