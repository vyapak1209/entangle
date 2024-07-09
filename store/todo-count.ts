import { create } from 'zustand';

import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';
import { Todo, TodoUpdate, allTodos, listTodos, todosByList } from '@/entities';

type TodoState = {
    totalCount: number,
    completedCount: number,
    initialiseReplicacheSubscription: (replicache: Replicache<M>) => void;
}

export const useTodoCountStore =  create<TodoState>((set) => ({
    totalCount: 0,
    todoCount: 0,
    completedCount: 0,
    initialiseReplicacheSubscription: (replicache: Replicache<M>) => {
        replicache.subscribe(async (tx) => allTodos(tx), {
            onData: (todos) => {
                set({ 
                    totalCount: todos?.length ?? 0,
                    completedCount: todos?.filter(todo => todo.status === "DONE").length ?? 0
                })
            }
        })
    }
}));

export const useTodoCount = (rep: Replicache<M> | null) => {
    const { totalCount, completedCount, initialiseReplicacheSubscription } = useTodoCountStore();

    useEffect(() => {
        if (rep) {
            initialiseReplicacheSubscription(rep as Replicache<M>);
        }
    }, [rep]);

    return { totalCount, completedCount };
};