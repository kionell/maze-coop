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
      userService.onUserLogout(() => {
        setState(null);
      });
      
      userService.logout();
    }
    else { 
      userService.onUserCreated((user) => {
        setState(user);
      });
      
      userService.create(username);
    }
  }

  useEffect(() => {
    async function initUser() {
      await userService.connect();
      
      userService.onUserFound((user: IUser) => {
        setState(user);
      });

      userService.onUserNotFound(() => {
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