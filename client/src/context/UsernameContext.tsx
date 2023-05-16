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

type UsernameContextDefaultValue = [string, Dispatch<SetStateAction<string>>];

export const UsernameContext = createContext<UsernameContextDefaultValue>([
  'Guest',
  () => {},
]);

interface IUsernameProviderProps {
  children: ReactNode;
}

export function UsernameProvider({ children }: IUsernameProviderProps) {
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const username = getCookie('username');

    if (typeof username !== 'string') return;
    
    setUsername(username);
  }, []);

  return (
    <UsernameContext.Provider value={[ username, setUsername ]}>
      {children}
    </UsernameContext.Provider>
  );
} 