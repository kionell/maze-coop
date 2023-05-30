import { useContext } from 'react';
import { UserContext } from '@context/UserContext';

const UserLogoutButton: React.FC = () => {
  const userState = useContext(UserContext);

  const onUserLogout = () => userState.set(null);
  
  return (
    <button onClick={onUserLogout}>Logout</button>
  );
}

export default UserLogoutButton;
