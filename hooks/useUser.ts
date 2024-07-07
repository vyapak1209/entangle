import { useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSpaceOnServer } from "@/api";
import { fetchOrCreateUserSpaceOnServer } from "@/api/controllers/user";

const initialState: UserState = {
  username: '',
  id: '',
  spaceID: '',
  loading: false,
  error: false,
};

function initialiseState() {
  return initialState;
}

type UserState = {
  username: string;
  id: string;
  spaceID: string;
  loading: boolean;
  error: boolean;
};

const reducer = (state: UserState, action: { type: 'FETCHING' | 'FETCHED' | 'ERROR', payload?: { username?: string, id?: string, spaceID?: string } }): UserState => {
  switch (action.type) {
    case 'FETCHING':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'FETCHED':
      return {
        ...state,
        username: action.payload?.username ?? '',
        id: action.payload?.id ?? '',
        spaceID: action.payload?.spaceID ?? '',
        loading: false,
        error: false,
      };
    case 'ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const useUser = (username: string | null) => {
  const [state, dispatch] = useReducer(reducer, null, initialiseState);
  console.log('here', state)

  useEffect(() => {
    
    if (!username) {
      return;
    }

    checkOrCreateUserSpace(username);
  }, [username]);

  const checkOrCreateUserSpace = async (username: string) => {
    console.log('here1', username)
    try {
      dispatch({ type: 'FETCHING' });
      let userData = await AsyncStorage.getItem(username);
      let id = '';
      let spaceID = '';

      console.log('in async', userData)
      if (JSON.parse(userData ?? "{}")?.id) {
        const parsedData = JSON.parse(userData ?? "{}");
        id = parsedData.id;
        spaceID = parsedData.spaceID;

        dispatch({ type: 'FETCHED', payload: { username, id, spaceID } });
      } else {
        const serverData = await fetchOrCreateUserSpaceOnServer(username);

        console.log('on server', serverData);
        
        id = serverData.id;
        spaceID = serverData.spaceID;
        await AsyncStorage.setItem(username, JSON.stringify({ id, spaceID }));
      }

      dispatch({ type: 'FETCHED', payload: { username, id, spaceID } });
    } catch (err) {
      console.log('Error:', err);
      dispatch({ type: 'ERROR' });
      throw new Error("Couldn't create or fetch user data");
    }
  };

  return state;
};