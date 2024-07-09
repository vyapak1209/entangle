import { create } from 'zustand';

import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';
import { Todo, TodoUpdate, todosByList } from '@/entities';

type TodoState = {
    todos: Todo[];
    loading: boolean;
    error: boolean;
    initialiseReplicacheSubscription: (replicache: Replicache<M>, listID: string) => void;
}

export const useTodoStore =  create<TodoState>((set) => ({
    todos: [],
    loading: false,
    error: false,
    todoAdaptors: {
        createTodo: () => {},
        deleteTodo: () => {}
    },
    initialiseReplicacheSubscription: (replicache: Replicache<M>, listID) => {
        replicache.subscribe(async (tx) => todosByList(tx, listID), {
            onData: (todos) => {
                set({ todos })
            }
        })
    }
}));

export const useTodos = (rep: Replicache<M> | null, listID: string) => {
    const { todos, initialiseReplicacheSubscription } = useTodoStore();

    useEffect(() => {
        if (rep) {
            initialiseReplicacheSubscription(rep as Replicache<M>, listID);
        }
    }, [rep, listID]);
    
    const createTodo = async (todo: Todo) => {
        await rep?.mutate.createTodo(todo);
    }

    const deleteTodo = async (todoId: string) => {
        await rep?.mutate.deleteTodo(todoId);
    }

    const updateTodo = async (todo: TodoUpdate) => {
        await rep?.mutate.updateTodo(todo);
    }

    return { todos, todoAdaptors: { createTodo, deleteTodo, updateTodo } };
};