import { 
  createContext, 
  useState,
  ReactNode,
  useEffect,
} from "react";

import { IUser } from "@common/interfaces/user.interface";
import { userService } from "../services/UserService";

type UserContextDefaultValue = {
  value: IUser | null;
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
  const [state, setState] = useState<IUser | null>(null);

  const setUser = (username: string | null) => {
    if (username === null) {
      userService.onLogout(() => {
        userService.reconnect();
        setState(null);
      });
      
      userService.logout();
    }
    else { 
      userService.onCreate(({ data, error }) => {
        if (!error) setState(data);
      });
      
      userService.create(username);
    }
  }

  useEffect(() => {
    async function initUser() {
      await userService.connect();
      
      userService.onFind(({ data, error }) => {
        if (!error) setState(data);
      });

      userService.onNotFound(() => {
        setState(null);
      })

      userService.find();
    }

    initUser();

    return () => {
      userService.removeAllListeners();
    }
  }, []);

  return (
    <UserContext.Provider value={{ value: state, set: setUser }}>
      {children}
    </UserContext.Provider>
  );
} 