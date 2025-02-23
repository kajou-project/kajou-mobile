import Reservation from "react-native-calendars/src/agenda/reservation-list/reservation";
import { Profile } from "./User.interface";

export interface Meal {
  id: number;
  title: string;
  address: string;
  description: string;
  date: string;
  category: string;
  foods: string;
  nb_guests: number;
  price: number;
  image: string;
  owner: Profile;
  created_at: string;
  updated_at: string;
  user_id: string;
  reservations: Reservation[];
}
