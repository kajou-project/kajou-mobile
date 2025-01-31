import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import AddMealScreen from "./AddMealScreen";
import { LocationProvider } from "../providers/LocationProvider";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <LocationProvider>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add" component={AddMealScreen} />
      </Tab.Navigator>
    </LocationProvider>
  );
}
