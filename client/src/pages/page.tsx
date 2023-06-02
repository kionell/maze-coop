import { useUserContext } from '@hooks/useUserContext';
import { useGameContext } from '@hooks/useGameContext';
import UserForm from '@components/UserForm';
import Dashboard from '@components/Dashboard';
import Game from '@components/Game';

export default function Page() {
  const userState = useUserContext();
  const gameState = useGameContext();

  if (gameState.info !== null) {
    return <Game />;
  }

  if (userState.value !== null) { 
    return <Dashboard />
  }

  return <UserForm />;
}
