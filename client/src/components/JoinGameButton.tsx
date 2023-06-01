import { gameService } from '@services/GameService';
import { useGameStartListener } from '@hooks/useGameStartListener';

interface JoinGameButtonProps {
  hostId: string;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ hostId }) => {
  useGameStartListener();
  
  return (
    <button onClick={() => gameService.join(hostId)}>Join Game</button>
  );
}

export default JoinGameButton;
