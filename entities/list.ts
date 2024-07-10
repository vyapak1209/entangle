import {z} from 'zod';
import {generate, Update} from '@rocicorp/rails';
import { ReadTransaction } from 'replicache';

export const listSchema = z.object({
  id: z.string(),
  title: z.string(),
  ownerID: z.string(),
});

export type List = z.infer<typeof listSchema>;
export type ListUpdate = Update<List>;

export const {
  init: createList,
  list: listLists,
  get: getList,
  delete: deleteList,
} = generate('list', listSchema.parse);

export async function allLists(tx: ReadTransaction) {
  try {
    const allLists = (await tx.scan({ prefix: 'list/' }).values().toArray()) as List[];
    return allLists;
  } catch (err) {
    console.log('err in todosByList', err)
  }
}