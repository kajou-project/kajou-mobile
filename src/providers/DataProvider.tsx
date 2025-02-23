import DataContext, { Category, DataContextType } from "../contexts/DataContext";
import Burger from "../assets/icons/burger.svg";
import BurgerWhite from "../assets/icons/burger-white.svg";
import Veggie from "../assets/icons/veggie.svg";
import VeggieWhite from "../assets/icons/veggie-white.svg";
import Fish from "../assets/icons/fish.svg";
import FishWhite from "../assets/icons/fish-white.svg";
import Donut from "../assets/icons/donut.svg";
import DonutWhite from "../assets/icons/donut-white.svg";
import Meat from "../assets/icons/meat.svg";
import MeatWhite from "../assets/icons/meat-white.svg";

export function DataProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const categories = [
    { name: "Street Food", icon: Burger, iconSelected: BurgerWhite },
    { name: "Veggie", icon: Veggie, iconSelected: VeggieWhite },
    { name: "Poissons", icon: Fish, iconSelected: FishWhite },
    { name: "Cuisine du monde", icon: Donut, iconSelected: DonutWhite },
    { name: "Cuisine familiale", icon: Meat, iconSelected: MeatWhite }
  ] as Category[];

  const value: DataContextType = {
    categories
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
