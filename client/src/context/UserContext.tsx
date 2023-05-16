'use client';

import { getCookie } from "cookies-next";
import { 
  createContext, 
  useState,
  Dispatch, 
  SetStateAction,
  ReactNode,
  useEffect, 
} from "react";

type UserContextDefaultValue = [ string, Dispatch<SetStateAction<string>> ];

export const UserContext = createContext<UserContextDefaultValue>([
  'Guest',
  () => {},
]);

interface IUserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: IUserProviderProps) {
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const username = getCookie('username');

    if (typeof username !== 'string') return;
    
    setUsername(username);
  }, []);

  return (
    <UserContext.Provider value={[ username, setUsername ]}>
      {children}
    </UserContext.Provider>
  );
} 