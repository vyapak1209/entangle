import { create } from 'zustand';
import { List, listLists } from "@/entities";

import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';


type ListState = {
    lists: List[];
    selectedList: List;
    setSelectedList: (listID: string) => void;
    initialiseReplicacheSubscription: (replicache: Replicache<M>) => void;
}

export const useListStore =  create<ListState>((set, get) => ({
    lists: [],
    selectedList: {} as List,
    setSelectedList: (listID: string) => {
        const selectedList = get().lists.filter(item => item.id === listID);

        set({ selectedList: selectedList?.[ 0 ] ?? {} })
    },
    initialiseReplicacheSubscription: (replicache: Replicache<M>) => {
        replicache.subscribe(async (tx) => {
            try {
                const lists = (await tx.scan().values().toArray()) as List[];
                return lists;
            } catch (err) {
                console.log('bkl error', err);
            }
        }, {
            onData: (lists) => {
                console.log("called in LIST subscription", lists)
                set({ lists })
            }
        });
    }
}));

export const useLists = (rep: Replicache<M> | null) => {
    const { lists, initialiseReplicacheSubscription } = useListStore();

    useEffect(() => {
        if (rep) {
            initialiseReplicacheSubscription(rep as Replicache<M>);
        }
    }, [rep]);

    const createList = async (list: List) => {
        await rep?.mutate?.createList(list);
    }

    const deleteList = async (listId: string) => {
        await rep?.mutate?.deleteList(listId)
    }

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
}