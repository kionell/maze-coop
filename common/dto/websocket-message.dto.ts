

export interface WebsocketMessageDto<T> {
  data: T;
  error: T extends NonNullable<T> ? null : string;
}
