import { useContext } from 'react';
import { gameService } from '@services/GameService';
import { UserContext } from '@context/UserContext';
import { GameContext } from '@context/GameContext';

const NewGameButton: React.FC = () => {
  const userState = useContext(UserContext);
  const playingState = useContext(GameContext);

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
