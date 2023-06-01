import { GameStatus } from "../enums/GameStatus";
import { GameConfig } from "./GameConfig"
import { GameMember } from "./GameMember";
import { GameMetadata } from "./GameMetadata";

export interface GameCompact {
  config: GameConfig;
  metadata: GameMetadata;
  members: (GameMember | null)[];
  status: GameStatus;
}