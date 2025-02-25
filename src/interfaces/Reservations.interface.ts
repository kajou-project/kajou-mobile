import { Event } from "./Events.interface";
import { Meal } from "./Meals.interface";

export interface Reservation {
  id: number;
  nb_people: number;
  user_id: string;
  meal_id?: number;
  event_id?: number;
  created_at: string;
  meal?: Meal;
  event?: Event;
}
