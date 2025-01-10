import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import Header from "../components/navigation/Header";
import AddMealScreen from "./AddMealScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ header: Header }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddMealScreen} />
    </Tab.Navigator>
  );
}
