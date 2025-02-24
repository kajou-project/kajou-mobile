import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import { AppState } from "react-native";
import { supabase } from "./src/utils/supabase";
import { LocaleConfig } from "react-native-calendars";
import { AuthProvider } from "./src/providers/AuthProvider";
import BottomTabs from "./src/screens/BottomTabs";
import SplashScreen from "./src/screens/SplashScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import BeforeSignUp from "./src/screens/BeforeSignUp";
import MealScreen from "./src/screens/MealScreen";
import SummuryScreen from "./src/screens/SummuryScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import MyMealsScreen from "./src/screens/MyMealsScreen";
import UpdateMealScreen from "./src/screens/UpdateMealScreen";
import UpdateProfileScreen from "./src/screens/UpdateProfileScreen";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const Stack = createStackNavigator();

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc."
  ],
  dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = "fr";

export default function App(): React.JSX.Element | null {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Vérifier la session au démarrage
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkSession();
  }, []);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Affichage conditionnel pour éviter un écran blanc au démarrage
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "BottomTabs" : "BeforeSignUp"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="BeforeSignUp" component={BeforeSignUp} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="Meal" component={MealScreen} />
            <Stack.Screen name="Summury" component={SummuryScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MyMeals" component={MyMealsScreen} />
            <Stack.Screen name="UpdateMeal" component={UpdateMealScreen} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
