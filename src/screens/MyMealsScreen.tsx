import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import ArrowLeft from "../assets/icons/chevron-left.svg";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Meal } from "../interfaces/Meals.interface";
import { supabase } from "../utils/supabase";
import { navigate } from "../utils/navigation";
import { format } from "date-fns";
import theme from "../styles/theme";
import { useData } from "../contexts/DataContext";
import Users from "../assets/icons/users-2.svg";
import Clock from "../assets/icons/clock.svg";
import Calendar from "../assets/icons/calendar-days-white.svg";

export default function MyMealsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { categories } = useData();

  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals(): Promise<void> {
    if (!user) {
      return;
    }

    // Récupérer les repas de l'utilisateur
    const { data, error } = await supabase
      .from("meals")
      .select(`*, reservations(id)`)
      .eq("user_id", user.id);

    if (error) {
      Alert.alert("Erreur", "Impossible de récupérer vos repas.");
      return;
    }

    if (data) {
      setFullMeals(data);
    }
  }

  async function setFullMeals(data: Meal[]): Promise<void> {
    const tmp = [];

    // Récupérer les profils des utilisateurs
    for (const m of data) {
      const { data: image } = supabase.storage.from("meal_posts").getPublicUrl(m.image);

      m.image = image.publicUrl;

      tmp.push(m);
    }

    setMeals(tmp);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 50
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft width={28} height={28} />
        </Pressable>

        <Text style={{ fontSize: 26, fontWeight: "bold" }}>Mes repas</Text>

        <View style={{ width: 28 }}></View>
      </View>

      {/* Les repas */}
      {meals.length === 0 && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>Vous n'avez pas de repas.</Text>
      )}

      {meals.map((meal) => (
        <Pressable
          key={meal.id}
          style={styles.meal}
          onPress={() => navigate(navigation, "UpdateMeal", { meal, categories })}
        >
          {/* Top Image */}
          <View style={{ position: "relative", marginBottom: -14 }}>
            <Image source={{ uri: meal.image }} style={styles.mealImg} />

            <View style={styles.opacity}>
              <Text style={{ fontSize: 16, color: "#fff" }}>{meal.price}€</Text>
            </View>
          </View>

          {/* Container infos */}
          <View style={styles.mealContainer}>
            <View style={styles.userImgContainer}>
              <Image
                source={require("../assets/images/louis-hansel-7qeQXRppR9o-unsplash.jpg")}
                style={styles.userImg}
              />
            </View>

            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>{meal.title}</Text>

              <View style={{ ...styles.inlineCenter, justifyContent: "space-between" }}>
                <View style={{ ...styles.inlineCenter, gap: 4 }}>
                  <Calendar width={20} height={20} />
                  <Text style={{ fontSize: 12, color: "#fff", marginRight: 4 }}>
                    {format(meal.date, "dd/MM")}
                  </Text>

                  <Clock width={20} height={20} />
                  <Text style={{ fontSize: 12, color: "#fff" }}>
                    {format(meal.date, "HH'h'mm")}
                  </Text>
                </View>

                <View style={{ ...styles.inlineCenter, gap: 4 }}>
                  <Text style={{ fontWeight: 600, color: "#fff" }}>
                    {meal.reservations.length}/{meal.nb_guests}
                  </Text>
                  <Users width={20} height={20} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64
  },
  meal: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 24
  },
  opacity: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 14,
    paddingHorizontal: 32,
    paddingBottom: 24
  },
  mealImg: {
    width: "100%",
    height: 100,
    resizeMode: "cover"
  },
  mealContainer: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 12
  },
  userImgContainer: {
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: theme.colors.primary[800]
  },
  userImg: {
    width: 50,
    height: 50,
    resizeMode: "cover"
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#fff",
    marginHorizontal: 4
  },
  inlineCenter: {
    flexDirection: "row",
    alignItems: "center"
  }
});
