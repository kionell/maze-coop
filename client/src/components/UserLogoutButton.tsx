import { useUserContext } from '@hooks/useUserContext';

const UserLogoutButton: React.FC = () => {
  const userState = useUserContext();

  const onUserLogout = () => userState.set(null);
  
  return (
    <button onClick={onUserLogout}>Logout</button>
  );
}

export default UserLogoutButton;
