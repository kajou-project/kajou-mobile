import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";
import { ScrollView } from "react-native-gesture-handler";
import Search from "../assets/icons/search.svg";
import theme from "../styles/theme";
import { Category, useData } from "../contexts/DataContext";
import Heart from "../assets/icons/heart.svg";
import HeartWhite from "../assets/icons/heart-white.svg";
import Users from "../assets/icons/users-2.svg";
import Clock from "../assets/icons/clock.svg";
import MapPin from "../assets/icons/map-pin.svg";
import Star from "../assets/icons/star_outline.svg";
import { supabase } from "../utils/supabase";
import { Event } from "../interfaces/Events.interface";
import { format } from "date-fns";
import { Meal } from "../interfaces/Meals.interface";
import { useNavigation } from "@react-navigation/native";
import { navigate } from "../utils/navigation";
import { useLocation } from "../contexts/LocationContext";
import Calendar from "../assets/icons/calendar-days-white.svg";

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { categories } = useData();
  const { addresses } = useLocation();

  const [category, setCategory] = useState<string>("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealNearby, setMealNearby] = useState<Meal | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchMeals();
  }, [addresses]);

  async function fetchEvents(): Promise<void> {
    const { data } = await supabase.from("events").select(`*, reservations: reservations(*)`);
    // .gt("date", new Date().toISOString());

    if (data) {
      setFullEvents(data);
    }
  }

  async function setFullEvents(data: Event[]): Promise<void> {
    const tmp = [];

    // Récupérer les profils des utilisateurs
    for (const e of data) {
      const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", e.user_id)
        .single();
      const { data: image } = supabase.storage.from("event_posts").getPublicUrl(e.image);

      e.image = image.publicUrl;

      if (companies) {
        e.owner = companies;
      }

      tmp.push(e);
    }

    setEvents(tmp);
  }

  async function fetchMeals(): Promise<void> {
    // Repas dans le futur
    const { data } = await supabase
      .from("meals")
      .select(`*, reservations: reservations(*)`)
      .gt("date", new Date().toISOString());

    if (data) {
      setFullMeals(data);
    }
  }

  async function fetchMealsByCategory(categoryName: string): Promise<void> {
    // Repas dans le futur
    const { data } = await supabase
      .from("meals")
      .select(`*, reservations: reservations(*)`)
      .eq("category", categoryName)
      .gt("date", new Date().toISOString());

    if (data) {
      setFullMeals(data);
    }
  }

  async function setFullMeals(data: Meal[]): Promise<void> {
    const tmp = [];

    // Récupérer les profils des utilisateurs
    for (const m of data) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", m.user_id)
        .single();
      const { data: image } = supabase.storage.from("meal_posts").getPublicUrl(m.image);

      m.image = image.publicUrl;

      if (profiles) {
        m.owner = profiles;
      }

      tmp.push(m);
    }

    // Repas à proximité
    const find = tmp.find((m) => {
      const match = m.address.match(/\d{5}/);
      const postalCode = match ? match[0] : null;

      if (postalCode === addresses[0].postalCode) {
        return m;
      }
    });

    // Supprimer le repas trouvé de la liste
    if (find) {
      setMealNearby(find);
      tmp.splice(tmp.indexOf(find), 1);
    } else {
      setMealNearby(null);
    }

    setMeals(tmp);
  }

  const getStyle = (i: number): Object => {
    return i === 0 ? { marginLeft: 24 } : { marginLeft: 0 };
  };

  function selectCategory(c: Category): void {
    if (category === c.name) {
      setCategory("");
      fetchMeals();
    } else {
      setCategory(c.name);
      fetchMealsByCategory(c.name);
    }
  }

  useDynamicHeader();

  return (
    <ScrollView style={styles.container}>
      {/* Seach Bar */}
      {/* <View style={styles.searchBar}>
        <Text style={styles.searchBarText}>Recherchez votre futur Kajou</Text>

        <Search width={20} height={20} />
      </View> */}

      {/* Catégories */}
      <View style={styles.categories}>
        {categories.map((c) => {
          return (
            <Pressable key={c.name} style={styles.category} onPress={() => selectCategory(c)}>
              <View style={category === c.name ? styles.categorySelected : styles.categoryIcon}>
                {category === c.name ? (
                  <c.iconSelected width={30} height={30} />
                ) : (
                  <c.icon width={30} height={30} />
                )}
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.categoryText}>{c.name}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {meals.length === 0 && !mealNearby && !!category && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>Aucun repas trouvé</Text>
      )}

      {/* À venir */}
      {meals.length > 0 && (
        <View>
          <Text style={styles.title}>À venir</Text>

          <ScrollView horizontal={true} style={styles.scrollView}>
            {meals.map((m, i) => {
              return (
                <Pressable
                  key={m.title}
                  style={{ ...styles.meal, ...getStyle(i) }}
                  onPress={() => navigate(navigation, "Meal", { meal: m, categories })}
                >
                  <Image source={{ uri: m.image }} style={styles.image} />

                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.mealTitle}>{m.title}</Text>
                    {/* <Heart width={16} height={16} /> */}
                  </View>

                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>{m.price}€</Text>
                    <View style={styles.mealRound}></View>
                    <Text>Chez {m.owner.firstname}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* À proximité */}
      {mealNearby && (
        <View>
          <Text style={styles.title}>À proximité</Text>

          <Pressable
            style={styles.mealNearby}
            onPress={() => navigate(navigation, "Meal", { meal: mealNearby, categories })}
          >
            {/* Top Image */}
            <View style={{ position: "relative", marginBottom: -14 }}>
              <Image source={{ uri: mealNearby.image }} style={styles.mealNearbyImg} />

              <View style={styles.opacity}>
                {/* <HeartWhite width={24} height={24} /> */}
                <Text style={{ fontSize: 16, color: "#fff" }}>{mealNearby.price}€</Text>
              </View>
            </View>

            {/* Container infos */}
            <View style={styles.mealNearbyContainer}>
              <View style={styles.userImgContainer}>
                <Image
                  source={require("../assets/images/louis-hansel-7qeQXRppR9o-unsplash.jpg")}
                  style={styles.userImg}
                />
              </View>

              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View style={{ ...styles.inlineCenter, gap: 4 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                    {mealNearby.title}
                  </Text>
                  <Text style={{ fontSize: 16, color: "#fff" }}>
                    chez {mealNearby.owner.firstname}
                  </Text>

                  {/* <View style={{ ...styles.inlineCenter, marginLeft: 8 }}>
                    <Text style={{ color: "#fff", fontWeight: 600 }}>{mealNearby.rating}</Text>
                    <Star width={18} height={18} />
                  </View> */}
                </View>

                <View style={{ ...styles.inlineCenter, justifyContent: "space-between" }}>
                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Calendar width={20} height={20} />
                    <Text style={{ fontSize: 12, color: "#fff", marginRight: 4 }}>
                      {format(mealNearby.date, "dd/MM")}
                    </Text>

                    <Clock width={20} height={20} />
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      {format(mealNearby.date, "HH'h'mm")}
                    </Text>
                    {/* <View style={styles.separator}></View>
                    <MapPin width={20} height={20} />
                    <Text style={{ fontSize: 12, color: "#fff" }}>{mealNearby.distance}m</Text> */}
                  </View>

                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: 600, color: "#fff" }}>
                      {mealNearby.reservations.length}/{mealNearby.nb_guests}
                    </Text>
                    <Users width={20} height={20} />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* Événements */}
      {!category && (
        <View>
          <Text style={styles.title}>Prochaines événements</Text>

          <View style={styles.events}>
            {events.map((e) => {
              return (
                <Pressable
                  key={e.title}
                  style={styles.event}
                  onPress={() => navigate(navigation, "Event", { event: e })}
                >
                  <Image source={{ uri: e.image }} style={styles.image} />

                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.mealTitle}>{e.title}</Text>
                    {/* <Heart width={16} height={16} /> */}
                  </View>

                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>{e.price}€</Text>
                    <View style={styles.mealRound}></View>
                    <Text>{format(e.date, "dd/MM")}</Text>
                    <View style={styles.mealRound}></View>
                    <Text>{format(e.date, "HH'h'mm")}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Recommandations */}
      {/* <Text style={styles.title}>Nos recommandations</Text>

      <View style={styles.recommendations}>
        {recommendations.map((r) => {
          return (
            <View key={r.name} style={styles.recommendation}>
              <Image source={r.image} style={styles.recoImg} />

              <View style={styles.recoContainer}>
                <View style={{ flexDirection: "column", gap: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{r.name}</Text>
                  <Text>Chez {r.owner}</Text>
                </View>

                <View style={styles.recoPrice}>
                  <Text style={{ fontSize: 16, color: "#fff" }}>{r.price}€</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16
  },
  searchBar: {
    backgroundColor: theme.colors.secondary[500],
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  searchBarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 8
  },
  category: {
    alignItems: "center"
  },
  categorySelected: {
    borderRadius: 10,
    backgroundColor: theme.colors.secondary[500],
    padding: 16,
    aspectRatio: 1 / 1,
    width: 60,
    marginBottom: 6
  },
  categoryIcon: {
    borderRadius: 10,
    backgroundColor: theme.colors.secondary[100],
    padding: 16,
    aspectRatio: 1 / 1,
    width: 60,
    marginBottom: 6
  },
  categoryText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginHorizontal: 24,
    marginBottom: 16
  },
  scrollView: {
    marginBottom: 8,
    paddingBottom: 8
  },
  meal: {
    width: 155,
    marginRight: 16
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 8
  },
  mealTitle: {
    fontWeight: "bold",
    marginBottom: 4
  },
  mealRound: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000"
  },
  mealNearby: {
    marginHorizontal: 24,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 16
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
  mealNearbyImg: {
    width: "100%",
    height: 100,
    resizeMode: "cover"
  },
  mealNearbyContainer: {
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
  },
  events: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    gap: 16,
    marginBottom: 16
  },
  event: {
    flex: 1
  },
  recommendations: {
    marginHorizontal: 24,
    gap: 16,
    marginBottom: 16
  },
  recommendation: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary[100]
  },
  recoImg: {
    width: 88,
    height: 88,
    borderRadius: 15
  },
  recoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
  },
  recoPrice: {
    backgroundColor: theme.colors.secondary[500],
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12
  }
});
