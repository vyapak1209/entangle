import type { WriteTransaction } from 'replicache';
import {Todo, TodoUpdate, List, Share} from '@/entities';

export type M = typeof mutators;

export const mutators = {
  createList: async (tx: WriteTransaction, list: List) => {
    const lists = (await tx.scan({ prefix: 'list/' }).values().toArray()) as List[];
    lists.sort((l1, l2) => l1.title.localeCompare(l2.title));

    await tx.set(`list/${list.id}`, list);
  },

  deleteList: async (tx: WriteTransaction, id: string) => {
    await tx.del(`list/${id}`);
  },

  createShare: async (tx: WriteTransaction, share: Omit<Share, "userID">) => {
    await tx.set(`share/${share.id}`, share);
  },

  deleteShare: async (tx: WriteTransaction, id: string) => {
    await tx.del(`share/${id}`);
  },

  updateTodo: async (tx: WriteTransaction, update: TodoUpdate) => {
    const prev = await tx.get<Todo>(`todo/${update.id}`);
    const next = {...prev, ...update};
    await tx.set(`todo/${next.id}`, next);
  },

  deleteTodo: async (tx: WriteTransaction, id: string) => {
    await tx.del(`todo/${id}`);
  },

  createTodo: async (tx: WriteTransaction, todo: Omit<Todo, 'sort'>) => {
    const todos = (await tx.scan({ prefix: 'todo/' }).values().toArray()) as Todo[];
    todos.sort((t1, t2) => t1.sort - t2.sort);

    const maxSort = todos.pop()?.sort ?? 0;
    await tx.set(`todo/${todo.id}`, {...todo, sort: maxSort + 1});
  }
};
