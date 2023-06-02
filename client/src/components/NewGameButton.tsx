import { gameService } from '@services/GameService';
import { useGameCreate } from '../hooks/useGameCreate';

const NewGameButton: React.FC = () => {
  useGameCreate();
  
  const onGameCreateClick = () => {
    gameService.create({
      rows: 10,
      columns: 10,
      maxPlayers: 3,
      maxSpread: 'auto',
    });
  };
  
  return (
    <button onClick={onGameCreateClick}>New Game</button>
  );
}

export default NewGameButton;
