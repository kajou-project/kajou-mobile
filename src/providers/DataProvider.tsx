import DataContext, {
  Categories,
  DataContextType,
  Event,
  Meal,
  MealNearby
} from "../contexts/DataContext";
import Burger from "../assets/icons/burger.svg";
import Veggie from "../assets/icons/veggie.svg";
import Fish from "../assets/icons/fish.svg";
import Donut from "../assets/icons/donut.svg";
import Meat from "../assets/icons/meat.svg";

export function DataProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const categories = [
    { name: "Burgers", icon: Burger },
    { name: "Veggie", icon: Veggie },
    { name: "Poissons", icon: Fish },
    { name: "Cuisine du monde", icon: Donut },
    { name: "Cuisine familiale", icon: Meat }
  ] as Categories[];

  const meals = [
    {
      name: "Pizza Party !",
      image: require("../assets/images/pexels-aleksandr-neplokhov-486399-2291445.jpg"),
      price: 4,
      owner: "Jules"
    },
    {
      name: "Burgeeeeer",
      image: require("../assets/images/pexels-yousefsammm-27049613.jpg"),
      price: 7,
      owner: "Louise"
    },
    {
      name: "Sandwich",
      image: require("../assets/images/pexels-khezez-30301908.jpg"),
      price: 7,
      owner: "Louis"
    },
    {
      name: "Tapas",
      image: require("../assets/images/pexels-studio1345-14009277.jpg"),
      price: 7,
      owner: "Martin"
    }
  ] as Meal[];

  const mealNearby = {
    name: "Pizza",
    image: require("../assets/images/pexels-aleksandr-neplokhov-486399-2291445.jpg"),
    price: 5.99,
    owner: "Julien",
    distance: 800,
    hour: "20h",
    rating: 4,
    nbPlaces: 4
  } as MealNearby;

  const events = [
    {
      name: "Soirée mexicaine",
      image: require("../assets/images/alvaro-bernal-ReySmTMcKEQ-unsplash.jpg"),
      duration: 90,
      price: 10
    },
    {
      name: "Cueillette & Cuisine",
      image: require("../assets/images/pexels-zen-chung-5528990.jpg"),
      duration: 150,
      price: 15
    }
  ] as Event[];

  const recommendations = [
    { name: "Soirée Halloween", image: require("../assets/images/pexels-cottonbro-6555002.jpg"), price: 4.99, owner: "Jules" },
    { name: "Brunch", image: require("../assets/images/pexels-picha-6210507.jpg"), price: 4.99, owner: "Jules" },
    { name: "Pizza", image: require("../assets/images/pexels-alinaskazka-20204589.jpg"), price: 4.99, owner: "Jules" },
  ] as Meal[];

  const value: DataContextType = {
    categories,
    meals,
    mealNearby,
    events,
    recommendations
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
