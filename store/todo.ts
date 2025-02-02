import { create } from 'zustand';
import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';
import { Todo, TodoUpdate, todosByList } from '@/entities';

type TodoState = {
  todos: Todo[];
  loading: boolean;
  error: boolean;
  initialiseReplicacheSubscription: (replicache: Replicache<M>, listID: string) => () => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: false,
  error: false,
  initialiseReplicacheSubscription: (replicache: Replicache<M>, listID) => {
    const unsubscribe = replicache.subscribe(
      async (tx) => {
        try {
          return await todosByList(tx, listID);
        } catch (err) {
          console.error('Error in Replicache transaction:', err);
          return [];
        }
      },
      {
        onData: (todos) => {
          set({ todos });
        },
        onError: (error) => {
          console.error('Error in Replicache subscription:', error);
          set({ error: true });
        },
      }
    );
    return () => {
      unsubscribe();
    };
  },
}));

export const useTodos = (rep: Replicache<M> | null, listID: string) => {
  const { todos, initialiseReplicacheSubscription } = useTodoStore();

  useEffect(() => {
    if (rep) {
      const unsubscribe = initialiseReplicacheSubscription(rep as Replicache<M>, listID);
      return () => {
        unsubscribe();
      };
    }
  }, [rep, listID]);

  const createTodo = async (todo: Todo) => {
    try {
      await rep?.mutate.createTodo(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await rep?.mutate.deleteTodo(todoId);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (todo: TodoUpdate) => {
    try {
      await rep?.mutate.updateTodo(todo);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return { todos, todoAdaptors: { createTodo, deleteTodo, updateTodo } };
};