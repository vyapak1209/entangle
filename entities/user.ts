import { ReadTransaction } from "replicache";

export type User = {
    id: string;
    username: string;
    spaceID: string;
};

export type UserUpdate = Partial<User> & Pick<User, "id">;