import { GameStatus } from '../enums/GameStatus';

export interface GameWinner {
  winnerId: string;
  winnername: string;
  finishedAt: number;
  status: GameStatus;
}
