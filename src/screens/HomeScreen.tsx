import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";
import { ScrollView } from "react-native-gesture-handler";
import Search from "../assets/icons/search.svg";
import theme from "../styles/theme";
import { useData } from "../contexts/DataContext";
import Heart from "../assets/icons/heart.svg";
import HeartWhite from "../assets/icons/heart-white.svg";
import Users from "../assets/icons/users-2.svg";
import Clock from "../assets/icons/clock.svg";
import MapPin from "../assets/icons/map-pin.svg";
import Star from "../assets/icons/star_outline.svg";

export default function HomeScreen(): React.JSX.Element {
  const { categories, meals, mealNearby, events, recommendations } = useData();

  const getStyle = (i: number) => {
    return i === 0 ? { marginLeft: 24 } : { marginLeft: 0 };
  };

  const durationToTime = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes}`;
  };

  useDynamicHeader();

  return (
    <ScrollView style={styles.container}>
      {/* Seach Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchBarText}>Recherchez votre futur Kajou</Text>

        <Search width={20} height={20} />
      </View>

      {/* Catégories */}
      {/* <View style={styles.categories}>
        {categories.map((c) => {
          return (
            <View key={c.name} style={styles.category}>
              <View style={styles.categoryIcon}>
                <c.icon />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.categoryText}>{c.name}</Text>
              </View>
            </View>
          );
        })}
      </View> */}

      {/* À venir */}
      <Text style={styles.title}>À venir</Text>

      <ScrollView horizontal={true} style={styles.scrollView}>
        {meals.map((m, i) => {
          return (
            <View key={m.name} style={{ ...styles.meal, ...getStyle(i) }}>
              <Image source={m.image} style={styles.image} />

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.mealTitle}>{m.name}</Text>
                <Heart width={16} height={16} />
              </View>

              <View style={{ ...styles.inlineCenter, gap: 4 }}>
                <Text style={{ fontWeight: "bold" }}>{m.price}€</Text>
                <View style={styles.mealRound}></View>
                <Text>Chez {m.owner}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* À proximité */}
      {mealNearby && (
        <View>
          <Text style={styles.title}>À proximité</Text>

          <View style={styles.mealNearby}>
            {/* Top Image */}
            <View style={{ position: "relative", marginBottom: -14 }}>
              <Image source={mealNearby.image} style={styles.mealNearbyImg} />

              <View style={styles.opacity}>
                <HeartWhite width={24} height={24} />
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
                    {mealNearby.name}
                  </Text>
                  <Text style={{ fontSize: 16, color: "#fff" }}>chez {mealNearby.owner}</Text>

                  <View style={{ ...styles.inlineCenter, marginLeft: 8 }}>
                    <Text style={{ color: "#fff", fontWeight: 600 }}>{mealNearby.rating}</Text>
                    <Star width={18} height={18} />
                  </View>
                </View>

                <View style={{ ...styles.inlineCenter, justifyContent: "space-between" }}>
                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Clock width={20} height={20} />
                    <Text style={{ fontSize: 12, color: "#fff" }}>{mealNearby.hour}</Text>
                    <View style={styles.separator}></View>
                    <MapPin width={20} height={20} />
                    <Text style={{ fontSize: 12, color: "#fff" }}>{mealNearby.distance}m</Text>
                  </View>

                  <View style={{ ...styles.inlineCenter, gap: 4 }}>
                    <Text style={{ fontWeight: 600, color: "#fff" }}>2/{mealNearby.nbPlaces}</Text>
                    <Users width={20} height={20} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Événements */}
      <Text style={styles.title}>Prochaines événements</Text>

      <View style={styles.events}>
        {events.map((e) => {
          return (
            <View key={e.name} style={styles.event}>
              <Image source={e.image} style={styles.image} />

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.mealTitle}>{e.name}</Text>
                <Heart width={16} height={16} />
              </View>

              <View style={{ ...styles.inlineCenter, gap: 4 }}>
                <Text style={{ fontWeight: "bold" }}>{e.price}€</Text>
                <View style={styles.mealRound}></View>
                <Text>{durationToTime(e.duration)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recommandations */}
      <Text style={styles.title}>Nos recommandations</Text>

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
      </View>
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
  categoryIcon: {
    borderRadius: 10,
    backgroundColor: theme.colors.secondary[50],
    padding: 16,
    aspectRatio: 1 / 1,
    width: 66,
    marginBottom: 6
  },
  categoryText: {
    flex: 1,
    textAlign: "center"
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "flex-end",
    justifyContent: "space-between",
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
    resizeMode: "cover",
    borderRadius: 50
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
    backgroundColor: theme.colors.secondary[100],
  },
  recoImg: {
    width: 88,
    height: 88,
    borderRadius: 15,
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
