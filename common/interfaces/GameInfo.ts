import { GameConfig } from './GameConfig'
import { GameMetadata } from './GameMetadata';
import { MemberList } from './MemberList';

export interface GameInfo {
  id: string;
  config: GameConfig;
  metadata: GameMetadata;
  members: MemberList;
}