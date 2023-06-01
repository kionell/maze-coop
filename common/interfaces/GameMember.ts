import { UserCompact } from "../interfaces/UserCompact";
import { Timestamp } from "../types/Timestamp";

export interface GameMember extends UserCompact {
  joinedAt: Timestamp;
}