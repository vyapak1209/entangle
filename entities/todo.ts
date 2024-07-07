// This file defines our Todo domain type in TypeScript, and a related helper
// function to get all Todos. You'd typically have one of these files for each
// domain object in your application.

import type { ReadTransaction } from "replicache";

export type Todo = {
  id: string;
  title: string;
  description?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  sort: number;
  listId: string;
  lastModified?: EpochTimeStamp;
};

export type TodoUpdate = Partial<Todo> & Pick<Todo, "id">;

export async function listTodos(tx: ReadTransaction) {
  console.log('called', await tx.scan().values().toArray())
  return (await tx.scan().values().toArray()) as Todo[];
}