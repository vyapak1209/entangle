import { User } from "@/entities/user";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveUserToStorage = async (user: Partial<User>) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
};


export const loadUserFromStorage = async () => {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};


export const clearUserFromStorage = async () => {
    await AsyncStorage.removeItem('user');
}