export interface Message {
  id: number;
  content: string;
  sender_id: number;
  created_at: string;
  image_url?: string;
}
