import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiErrorResponse, ApiResponse, create } from 'apisauce'

// define the api
const api = create({
    baseURL: 'http://192.168.0.101:3000'
})

export const createSpaceOnServer = async (spaceID?: string | null): Promise<ApiResponse<{ spaceID: string }>> => {
    return api.post(
        '/api/replicache/createSpace',
        { spaceID },
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
}


export const createUserOnServer = async (user: { username: string, spaceID: string }) => { 
    return api.post(
        '/api/entangle/createUser',
        { ...user },
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
}


export const fetchUserSpaceFromServer = async (username: string): Promise<ApiResponse<{ id: string, username: string, spaceID: string | null }>> => {
    
    let authToken: string | null = null;

    // try {
    //     authToken = await AsyncStorage.getItem("authToken");

    //     if (!authToken) {
    //         throw new Error('There was a problem in fetching the Auth Token')
    //     }

    // } catch (err) {
    //     return Promise.reject(err);
    // }

    return api.post(
        '/api/entangle/fetchUser',
        { username },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "authToken"
            }
        }
    );
}


export const fetchListFromServer = async (userId: string) => {

    // try {
    //     authToken = await AsyncStorage.getItem("authToken");

    //     if (!authToken) {
    //         throw new Error('There was a problem in fetching the Auth Token')
    //     }

    // } catch (err) {
    //     return Promise.reject(err);
    // }

    return api.post(
        '/api/entangle/fetchLists',
        { userId },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "authToken"
            }
        }
    );
}