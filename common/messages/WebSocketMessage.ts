export interface WebSocketMessage<T> {
  data: T;
  error: T extends NonNullable<T> ? null : string;
}
