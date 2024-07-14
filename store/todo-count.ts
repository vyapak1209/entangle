import { create } from 'zustand';

import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';
import { allTodos, todosByList } from '@/entities';

type TodoState = {
    totalCount: number,
    completedCount: number,
    initialiseReplicacheSubscription: (replicache: Replicache<M>, listID?: string) => void;
}

export const useTodoCountStore =  create<TodoState>((set) => ({
    totalCount: 0,
    completedCount: 0,
    initialiseReplicacheSubscription: (replicache: Replicache<M>, listID?: string) => {
        replicache.subscribe(async (tx) => {
            if (listID) {
                console.log('this was called')
                return todosByList(tx, listID)
            } else {
                return allTodos(tx)
            } 
        }, {
            onData: (todos) => {
                set({ 
                    totalCount: todos?.length ?? 0,
                    completedCount: todos?.filter(todo => todo.status === "DONE").length ?? 0
                })
            }
        })
    }
}));

export const useTodoCount = (rep: Replicache<M> | null, listID?: string) => {
    const { totalCount, completedCount, initialiseReplicacheSubscription } = useTodoCountStore();

    useEffect(() => {
        if (rep) {
            initialiseReplicacheSubscription(rep as Replicache<M>, listID);
        }
    }, [rep]);

    return { totalCount, completedCount };
};