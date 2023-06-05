// import { useLeavePageConfirm } from '@hooks/useLeavePageConfirm';
import { useGameStateUpdate } from '@hooks/useGameStateUpdate';
import { useGameContext } from '@hooks/useGameContext';
import { GameStatus } from '@common/enums/GameStatus';
import WaitingScreen from './WaitingScreen';
import Maze from '../components/Maze';

export default function Game() {
  const gameState = useGameContext();

  // useLeavePageConfirm();
  useGameStateUpdate();

  if (gameState.state) {
    const status = gameState.state.status;

    switch (status) {
      case GameStatus.Started: return <Maze />;
    }
  }

  return <WaitingScreen />;
}
