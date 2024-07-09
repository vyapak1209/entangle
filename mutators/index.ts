import type { WriteTransaction } from 'replicache';
import {Todo, listTodos, TodoUpdate} from '@/entities';
import {createList, deleteList} from '@/entities';
import {createShare, deleteShare} from '@/entities';

export type M = typeof mutators;

export const mutators = {
  createList,
  deleteList,

  createShare,
  deleteShare,

  updateTodo: async (tx: WriteTransaction, update: TodoUpdate) => {
    const prev = await tx.get<Todo>(`todo/${update.id}`);
    const next = {...prev, ...update};
    await tx.set(`todo/${next.id}`, next);
  },

  deleteTodo: async (tx: WriteTransaction, id: string) => {
    await tx.del(`todo/${id}`);
  },

  createTodo: async (tx: WriteTransaction, todo: Omit<Todo, 'sort'>) => {
    const todos = (await tx.scan().values().toArray()) as Todo[];
    todos.sort((t1, t2) => t1.sort - t2.sort);

    const maxSort = todos.pop()?.sort ?? 0;
    await tx.set(`todo/${todo.id}`, {...todo, sort: maxSort + 1});
  }
};
