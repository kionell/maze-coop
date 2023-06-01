import { gameService } from '@services/GameService';
import { useUserContext } from '@hooks/useUserContext';
import { useGameContext } from '@hooks/useGameContext';

const NewGameButton: React.FC = () => {
  const userState = useUserContext();
  const gameState = useGameContext();

  const onRoomCreateClick = () => {
    if (!userState.value) return;

    gameService.onCreate((message) => {
      gameState.set(message.data);
    });

    gameService.create({
      rows: 10,
      columns: 10,
      maxPlayers: 2,
      maxSpread: 'auto',
    });
  };
  
  return (
    <button onClick={onRoomCreateClick}>New Game</button>
  );
}

export default NewGameButton;
