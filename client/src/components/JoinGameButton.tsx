import { gameService } from '@services/GameService';
import { useGameConnect } from '@hooks/useGameConnect';

interface JoinGameButtonProps {
  id: string;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ id }) => {
  useGameConnect();

  const onGameJoinClick = () => gameService.join(id);
  
  return (
    <button onClick={onGameJoinClick}>Join Game</button>
  );
}

export default JoinGameButton;
