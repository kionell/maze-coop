import { gameService } from '@services/GameService';
import { usePlayerListUpdate } from '@hooks/usePlayerListUpdate';

interface JoinGameButtonProps {
  id: string;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ id }) => {
  usePlayerListUpdate();
  
  return (
    <button onClick={() => gameService.join(id)}>Join Game</button>
  );
}

export default JoinGameButton;
