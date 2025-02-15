import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import AddMealScreen from "./AddMealScreen";
import { LocationProvider } from "../providers/LocationProvider";
import ReservationScreen from "./ReservationScreen";
import CommunityScreen from "./CommunityScreen";
import EventsScreen from "./EventsScreen";
import Bottom from "../components/navigation/Bottom";
import Home from "../assets/icons/home.svg";
import HomeBold from "../assets/icons/home-bold.svg";
import Reservation from "../assets/icons/resa.svg";
import ReservationBold from "../assets/icons/resa-bold.svg";
import Plus from "../assets/icons/plus-circle.svg";
import PlusBold from "../assets/icons/plus-circle-bold.svg";
import Users from "../assets/icons/users.svg";
import UsersBold from "../assets/icons/users-bold.svg";
import Event from "../assets/icons/event.svg";
import EventBold from "../assets/icons/event-bold.svg";

const Tab = createBottomTabNavigator();

export default function BottomTabs(): React.JSX.Element {
  return (
    <LocationProvider>
      <Tab.Navigator tabBar={props => Bottom(props)}>
        <Tab.Screen name="Home" component={HomeScreen} initialParams={{
          name: "Home",
          icon: Home,
          iconSelected: HomeBold,
        }} />
        <Tab.Screen name="Reservation" component={ReservationScreen} initialParams={{
          name: "Réservation",
          icon: Reservation,
          iconSelected: ReservationBold,
        }} />
        <Tab.Screen name="Add" component={AddMealScreen} initialParams={{
          name: "Ajouter",
          icon: Plus,
          iconSelected: PlusBold,
        }} />
        <Tab.Screen name="Community" component={CommunityScreen} initialParams={{
          name: "Commu",
          icon: Users,
          iconSelected: UsersBold,
        }} />
        <Tab.Screen name="Events" component={EventsScreen} initialParams={{
          name: "Événements",
          icon: Event,
          iconSelected: EventBold,
        }} />
      </Tab.Navigator>
    </LocationProvider>
  );
}
