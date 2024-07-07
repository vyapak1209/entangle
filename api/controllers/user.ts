import { User } from "@/entities/user";
import { createSpaceOnServer, createUserOnServer, fetchUserSpaceFromServer } from ".."
import { randomUUID } from "expo-crypto";

export const fetchOrCreateUserSpaceOnServer = async (username: string): Promise<{ id: string, username: string, spaceID: string }> => {
    try {
        const userOnServer = await fetchUserSpaceFromServer(username);

        if (userOnServer?.data?.spaceID) {
            return Promise.resolve(userOnServer?.data as User);
        } else {
            const spaceResponse = await createSpaceOnServer();

            // We can assume that if spaceID is not present, the user simply does not exist.
            // Because we create the space whenever we create the user and save it.
            // We can handle this situation in a much better way with a single API to fetch and create space for the user.
            // I am using ReplicacheServer where the replicache controllers are abstracted.

            const user: Omit<User, "id"> = {
                username,
                spaceID: spaceResponse?.data?.spaceID ?? randomUUID(),
            }

            const userOnServer = await createUserOnServer(user);

            return Promise.resolve(userOnServer?.data as User);
        }

    } catch (err) {
        return Promise.reject(err);
    }
}