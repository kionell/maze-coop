import { Timestamp } from "../types/Timestamp";

export interface GameMetadata {
  hostId: string;
  hostname: string;
  createdAt: Timestamp;
  finishedAt?: Timestamp;
}