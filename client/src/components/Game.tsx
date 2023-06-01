// import { useLeavePageConfirm } from "@hooks/useLeavePageConfirm";
import { useGameCancelListener } from '@hooks/useGameCancelListener';
import { useGameContext } from '@hooks/useGameContext';
import { GameStatus } from '@common/enums/GameStatus';
import WaitingScreen from './WaitingScreen';
import Maze from './Maze';

export default function Game() {
  const gameState = useGameContext();

  // useLeavePageConfirm();
  useGameCancelListener();

  if (gameState.value?.status === GameStatus.Started) {
    return <Maze />
  }

  return <WaitingScreen />;
}
