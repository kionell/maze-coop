import { useContext } from 'react';
import { UserContext } from '@context/UserContext';
import { GameContext } from '@context/GameContext';
import { gameService } from '../services/GameService';

interface JoinGameButtonProps {
  hostId: string;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ hostId }) => {
  const userState = useContext(UserContext);
  const playingState = useContext(GameContext);

  const onJoinClick = () => {
    if (!userState.value) return;

    gameService.join(hostId);
    playingState.set(true);
  };
  
  return (
    <button onClick={onJoinClick}>Join Game</button>
  );
}

export default JoinGameButton;
