// import { useLeavePageConfirm } from "@hooks/useLeavePageConfirm";
import { usePlayerListUpdate } from '@hooks/usePlayerListUpdate';
import { useGameContext } from '@hooks/useGameContext';
import { GameStatus } from '@common/enums/GameStatus';
import WaitingScreen from './WaitingScreen';
import Maze from './Maze';

export default function Game() {
  const gameState = useGameContext();

  // useLeavePageConfirm();
  usePlayerListUpdate();

  if (gameState.value?.status === GameStatus.Started) {
    return <Maze />
  }

  return <WaitingScreen />;
}
