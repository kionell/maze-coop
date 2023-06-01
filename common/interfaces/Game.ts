import { ChatMessage } from './ChatMessage';
import { GameCompact } from './GameCompact';
import { GameLayout } from './GameLayout';
import { GameState } from './GameState';

export interface Game extends GameCompact  {
  state: GameState;
  layout: GameLayout;
  chat: ChatMessage[];
}
