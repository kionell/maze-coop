import { gameService } from '@services/GameService';
import { useUserContext } from '@hooks/useUserContext';
import { useGameContext } from '@hooks/useGameContext';

const NewGameButton: React.FC = () => {
  const userState = useUserContext();
  const gameState = useGameContext();

  const onRoomCreateClick = () => {
    if (!userState.value) return;

    gameService.create();
    playingState.set(true);
  };
  
  return (
    <button onClick={onRoomCreateClick}>New Game</button>
  );
}

export default NewGameButton;
