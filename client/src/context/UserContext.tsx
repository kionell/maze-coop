import { 
  createContext, 
  useState,
  ReactNode,
} from 'react';

import { useEffectOnce } from 'react-use';
import { UserInfo } from '@common/interfaces/UserInfo';
import { userService } from '@services/UserService';

type UserContextDefaultValue = {
  value: UserInfo | null;
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
  const [localUser, setLocalUser] = useState<UserInfo | null>(null);

  const setUser = async (username: string | null) => {
    if (localUser?.username === username) return;
    
    if (username === null) {
      await userService.logout();

      return setLocalUser(null);
    }
     
    const message = await userService.create(username);

    setLocalUser(message.data);
  }

  useEffectOnce(() => {
    userService.find().then((message) => setLocalUser(message.data));
  });

  return (
    <UserContext.Provider value={{ value: localUser, set: setUser }}>
      {children}
    </UserContext.Provider>
  );
} 