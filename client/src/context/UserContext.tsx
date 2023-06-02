import { 
  createContext, 
  useState,
  ReactNode,
} from 'react';

import { useEffectOnce } from 'react-use';
import { UserCompact } from "@common/interfaces/UserCompact";
import { userService } from '../services/UserService';

type UserContextDefaultValue = {
  value: UserCompact | null;
  set: (username: string | null) => void;
};

export const UserContext = createContext<UserContextDefaultValue>({
  value: null,
  set: () => {},
});

interface IUserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: IUserProviderProps) {
  const [state, setState] = useState<UserCompact | null>(null);

  const setUser = async (username: string | null) => {
    if (state?.username === username) return;
    
    if (username === null) {
      await userService.logout();

      return setState(null);
    }
     
    const message = await userService.create(username);

    setState(message.data);
  }

  useEffectOnce(() => {
    userService.find().then((message) => setState(message.data));
  });

  return (
    <UserContext.Provider value={{ value: state, set: setUser }}>
      {children}
    </UserContext.Provider>
  );
} 