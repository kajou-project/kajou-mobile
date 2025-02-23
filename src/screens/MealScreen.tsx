import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ArrowLeft from "../assets/icons/keyboard_arrow_left.svg";
import { useNavigation } from "@react-navigation/native";
import theme from "../styles/theme";
import { Meal } from "../interfaces/Meals.interface";
import { Category } from "../contexts/DataContext";
import { useEffect, useState } from "react";
import Users from "../assets/icons/users-2-black.svg";
import { format } from "date-fns";
import Calendar from "../assets/icons/calendar-days.svg";
import Pin from "../assets/icons/map-pin-black.svg";
import Button from "../components/shared/Button";
import MapView, { Marker } from "react-native-maps";
import { getCoordinate } from "../services/address-gouv";
import * as Clipboard from "expo-clipboard";
import { navigate } from "../utils/navigation";

export default function MealScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const { meal, categories }: { meal: Meal; categories: Category[] } = route.params;
  const [category, setCategory] = useState<Category | null>(null);
  const [coordinate, setCoordinate] = useState<any | null>(null);

  useEffect(() => {
    if (meal.category) {
      const category = categories.find((category) => category.name === meal.category);
      setCategory(category || null);
    }

    if (meal.address) {
      fetchAdress();
    }
  }, []);

  async function fetchAdress(): Promise<void> {
    const c = await getCoordinate(meal.address);
    setCoordinate(c);
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(meal.address);
  };

  return (
    <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: meal.image }} style={styles.image} />
        <View style={styles.opacity}></View>

        <View style={styles.headerContent}>
          <SafeAreaView
            style={{ flexDirection: "column", justifyContent: "space-between", flex: 1 }}
          >
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft />
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
              <View style={styles.userImgContainer}>
                <Image
                  source={require("../assets/images/louis-hansel-7qeQXRppR9o-unsplash.jpg")}
                  style={styles.userImg}
                />
              </View>

              <View>
                <Text style={styles.title}>{meal.title}</Text>

                <TouchableOpacity>
                  <Text style={styles.subTitle}>Voir le profil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}
        >
          <View>
            {category && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <category.icon width={36} height={36} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>0/{meal.nb_guests}</Text>
            <Users />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{meal.price}€</Text>
              <View style={{ height: "100%", width: 1, backgroundColor: "#000" }}></View>
              <Text style={{ fontSize: 16 }}>{format(new Date(meal.date), "dd/MM")}</Text>
              <Calendar width={20} height={20} />
            </View>
          </View>

          <Text style={{ fontSize: 16 }}>{format(new Date(meal.date), "HH'h'mm")}</Text>
        </View>

        <Text style={{ marginBottom: 24 }}>{meal.description}</Text>

        <Text style={{ marginBottom: 12, fontSize: 26, fontWeight: 600 }}>
          Les principaux aliments
        </Text>

        <View style={styles.foodsContainer}>
          {meal.foods.split(",").map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodItemText}>{food}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}
          onPress={copyToClipboard}
        >
          <Pin width={24} height={24} />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 24 }}>{meal.address}</Text>
        </TouchableOpacity>

        <MapView
          style={styles.map}
          region={{ ...coordinate, latitudeDelta: 0.003, longitudeDelta: 0.003 }}
        >
          <Marker coordinate={coordinate} />
        </MapView>

        <Button
          type="primary"
          label="Réservez votre Kajou !"
          onPress={() => navigate(navigation, "Summury", { meal, coordinate })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 220
  },
  headerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: 24
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20
  },
  userImgContainer: {
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: theme.colors.primary[600]
  },
  userImg: {
    width: 60,
    height: 60,
    resizeMode: "cover"
  },
  title: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "bold",
    marginBottom: 8
  },
  subTitle: {
    color: theme.colors.white,
    textDecorationLine: "underline"
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0
  },
  opacity: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    top: 0,
    left: 0
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "bold"
  },
  foodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24
  },
  foodItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.secondary[100],
    borderRadius: 999
  },
  foodItemText: {
    color: theme.colors.secondary[800]
  },
  map: {
    width: "100%",
    height: 150,
    marginBottom: 24,
    borderRadius: 10
  }
});
