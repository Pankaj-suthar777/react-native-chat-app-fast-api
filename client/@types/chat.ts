export interface Chat {
  chat_id: number;
  last_message: string;
  other_user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
}