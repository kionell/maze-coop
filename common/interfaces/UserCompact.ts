import { Timestamp } from "../types/Timestamp";

export interface UserCompact {
  id: string;
  username: string;
  createdAt: Timestamp;
}