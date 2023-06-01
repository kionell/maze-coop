import { gameService } from '@services/GameService';
import { usePlayerListUpdate } from '@hooks/usePlayerListUpdate';

interface JoinGameButtonProps {
  hostId: string;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ hostId }) => {
  usePlayerListUpdate();
  
  return (
    <button onClick={() => gameService.join(hostId)}>Join Game</button>
  );
}

export default JoinGameButton;
