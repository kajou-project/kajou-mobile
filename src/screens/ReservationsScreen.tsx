import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";
import { supabase } from "../utils/supabase";
import { Meal } from "../interfaces/Meals.interface";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { navigate } from "../utils/navigation";
import { format } from "date-fns";
import Users from "../assets/icons/users-2.svg";
import Clock from "../assets/icons/clock.svg";
import { useData } from "../contexts/DataContext";
import theme from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";
import { Reservation } from "../interfaces/Reservations.interface";
import Calendar from "../assets/icons/calendar-days-white.svg";

export default function ReservationsScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const { categories } = useData();
  const { user } = useAuth();
  const [future, setFuture] = useState<Reservation[]>([]);
  const [past, setPast] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals(): Promise<void> {
    if (!user) {
      return;
    }

    // Récupérer les réservations
    const { data } = await supabase
      .from("reservations")
      .select(`*, meal:meal_id(*, reservations(id))`)
      .eq("user_id", user.id);

    if (data) {
      setFullMeals(data);
    }
  }

  async function setFullMeals(data: Reservation[]): Promise<void> {
    const tmp = [];

    // Récupérer les profils des utilisateurs
    for (const r of data) {
      if (!r.meal) {
        continue;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", r.meal.user_id);
      const { data: image } = supabase.storage.from("meal_posts").getPublicUrl(r.meal.image);

      r.meal.image = image.publicUrl;

      if (profiles) {
        r.meal.owner = profiles[0];
      }

      tmp.push(r);
    }

    const future = tmp.filter((r) => new Date(r.meal!.date) > new Date());
    const past = tmp.filter((r) => new Date(r.meal!.date) < new Date());

    setFuture(future);
    setPast(past);
  }

  useDynamicHeader();

  return (
    <ScrollView style={{ padding: 24 }}>
      <Text style={styles.title}>Réservations</Text>

      {future.length === 0 && past.length === 0 && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>Vous n'avez aucune réservation</Text>
      )}

      {future.length > 0 && (
        <View>
          <Text style={styles.title2}>À venir</Text>
          {future.map((r) => (
            <Pressable
              key={r.id}
              style={styles.meal}
              onPress={() => navigate(navigation, "Meal", { meal: r.meal, categories })}
            >
              {/* Top Image */}
              <View style={{ position: "relative", marginBottom: -14 }}>
                <Image source={{ uri: r.meal?.image }} style={styles.mealImg} />

                <View style={styles.opacity}>
                  <Text style={{ fontSize: 16, color: "#fff" }}>{r.meal?.price}€</Text>
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
                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                      {r.meal?.title}
                    </Text>
                    <Text style={{ fontSize: 16, color: "#fff" }}>
                      chez {r.meal?.owner.firstname}
                    </Text>
                  </View>

                  <View style={{ ...styles.inlineCenter, justifyContent: "space-between" }}>
                    {r.meal && (
                      <View style={{ ...styles.inlineCenter, gap: 4 }}>
                        <Calendar width={20} height={20} />
                        <Text style={{ fontSize: 12, color: "#fff", marginRight: 4 }}>
                          {format(r.meal.date, "dd/MM")}
                        </Text>

                        <Clock width={20} height={20} />
                        <Text style={{ fontSize: 12, color: "#fff" }}>
                          {format(r.meal.date, "HH'h'mm")}
                        </Text>
                      </View>
                    )}

                    <View style={{ ...styles.inlineCenter, gap: 4 }}>
                      <Text style={{ fontWeight: 600, color: "#fff" }}>
                        {r.meal?.reservations.length}/{r.meal?.nb_guests}
                      </Text>
                      <Users width={20} height={20} />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {past.length > 0 && (
        <View>
          <Text style={styles.title2}>Passées</Text>
          {past.map((r) => (
            <Pressable
              key={r.id}
              style={styles.meal}
              onPress={() => navigate(navigation, "Meal", { meal: r.meal, categories })}
            >
              {/* Top Image */}
              <View style={{ position: "relative", marginBottom: -14 }}>
                <Image source={{ uri: r.meal?.image }} style={styles.mealImg} />

                <View style={styles.opacity}>
                  <Text style={{ fontSize: 16, color: "#fff" }}>{r.meal?.price}€</Text>
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
                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                      {r.meal?.title}
                    </Text>
                    <Text style={{ fontSize: 16, color: "#fff" }}>
                      chez {r.meal?.owner.firstname}
                    </Text>
                  </View>

                  <View style={{ ...styles.inlineCenter, justifyContent: "space-between" }}>
                    {r.meal && (
                      <View style={{ ...styles.inlineCenter, gap: 4 }}>
                        <Calendar width={20} height={20} />
                        <Text style={{ fontSize: 12, color: "#fff", marginRight: 4 }}>
                          {format(r.meal.date, "dd/MM")}
                        </Text>

                        <Clock width={20} height={20} />
                        <Text style={{ fontSize: 12, color: "#fff" }}>
                          {format(r.meal.date, "HH'h'mm")}
                        </Text>
                      </View>
                    )}

                    <View style={{ ...styles.inlineCenter, gap: 4 }}>
                      <Text style={{ fontWeight: 600, color: "#fff" }}>
                        {r.meal?.reservations.length}/{r.meal?.nb_guests}
                      </Text>
                      <Users width={20} height={20} />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50
  },
  title2: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24
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
