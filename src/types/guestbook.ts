export interface GuestbookMessage {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface GuestbookRequest {
  content: string;
}
