import { Todo, TodoUpdate, listTodos } from "@/entities/todo";
import type { WriteTransaction } from "replicache";

export type M = typeof TODO_MUTATORS;

export const TODO_MUTATORS = {
  updateTodoStatus: async (tx: WriteTransaction, update: TodoUpdate) => {
    const prev = (await tx.get(update.id)) as Todo;
    const next = { ...prev, ...update };
    await tx.put(next.id, next);
  },

  deleteTodo: async (tx: WriteTransaction, id: string) => {
    await tx.del(id);
  },

  createTodo: async (tx: WriteTransaction, todo: Omit<Todo, "sort">) => {
    const todos = await listTodos(tx);
    todos.sort((t1, t2) => t1.sort - t2.sort);

    const maxSort = todos.pop()?.sort ?? 0;
    await tx.put(todo.id, { ...todo, sort: maxSort + 1 });
  }
};
