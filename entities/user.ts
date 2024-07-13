export type User = {
    userID: string;
    username: string;
    passkey: number;
}

export type ApiUserPayload = Partial<User>;