
import { List } from "@/entities";
import { fetchListFromServer } from ".."

export const fetchUserListsFromServer = async (id: string): Promise<{ lists: List[] }> => {
    try {
        const listsOnServer = await fetchListFromServer(id);

        return Promise.resolve(listsOnServer?.data as { lists: List[] });

    } catch (err) {
        return Promise.reject(err);
    }
}