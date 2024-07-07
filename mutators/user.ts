
import { User, UserUpdate } from "@/entities/user";
import { WriteTransaction } from "replicache";

export const USER_MUTATORS = {
    createUser: async (tx: WriteTransaction, user: Omit<User, "sort">) => {
        try {
            const { id, username } = user;
            await tx.put(user.id, { ...user });
        } catch (err) {
            console.log(err)
        }
    },

    updateUserData: async (tx: WriteTransaction, update: UserUpdate) => {
        try {
            const prev = (await tx.get(update.id)) as User;
            const next = { ...prev, ...update };
            
            await tx.put(next.id, next);
        } catch (err) {
            console.log(err)
        }
    }
}