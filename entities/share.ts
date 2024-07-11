import {z} from 'zod';
import {generate} from '@rocicorp/rails';
import { ReadTransaction } from 'replicache';

export const shareSchema = z.object({
  id: z.string(),
  listID: z.string(),
  userID: z.string(),
});

export type Share = z.infer<typeof shareSchema>;

export const {
  init: createShare,
  list: listShares,
  delete: deleteShare,
} = generate('share', shareSchema.parse);

export async function sharesByList(tx: ReadTransaction, listID: string) {
  try {
    const allShares = (await tx.scan({ prefix: 'share/' }).values().toArray()) as Share[];
    return allShares.filter(share => share.listID === listID);
  } catch (err) {
    console.log('err in sharesByList', err)
  }
}