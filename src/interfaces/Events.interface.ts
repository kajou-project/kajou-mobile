export interface Event {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  date: string;
  image: string;
  key_words: string;
  nb_guests: number;
  created_at: string;
  updated_at: string | null;
  user_id: string;
}
