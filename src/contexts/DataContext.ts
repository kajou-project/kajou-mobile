import { createContext, useContext } from "react";

export interface DataContextType {
  categories: Category[];
}

export interface Category {
  name: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  iconSelected: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const DataContext = createContext({
  categories: []
} as DataContextType);

export const useData = () => useContext(DataContext);

export default DataContext;
