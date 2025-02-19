import { createContext, useContext } from "react";
import { ImageSourcePropType } from "react-native";

export interface DataContextType {
  categories: Categories[];
  meals: Meal[];
  mealNearby: MealNearby | null;
  events: Event[];
  recommendations: Meal[];
}

export interface Categories {
  name: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

export interface Meal {
  name: string;
  image: ImageSourcePropType;
  price: number;
  owner: string;
}

export interface MealNearby {
  name: string;
  image: ImageSourcePropType;
  price: number;
  owner: string;
  distance: number;
  hour: string;
  rating: number;
  nbPlaces: number;
}

export interface Event {
  name: string;
  image: ImageSourcePropType;
  duration: number;
  price: number;
}

const DataContext = createContext({
  categories: [],
  meals: [],
  mealNearby: null,
  events: [],
  recommendations: []
} as DataContextType);

export const useData = () => useContext(DataContext);

export default DataContext;
