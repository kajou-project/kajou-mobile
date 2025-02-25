import { useNavigation } from "@react-navigation/native";
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
import Users from "../assets/icons/users-2-black.svg";
import ArrowLeft from "../assets/icons/keyboard_arrow_left.svg";
import { Event } from "../interfaces/Events.interface";
import { format } from "date-fns";
import Calendar from "../assets/icons/calendar-days.svg";
import theme from "../styles/theme";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { getCoordinate } from "../services/address-gouv";
import * as Clipboard from "expo-clipboard";
import Button from "../components/shared/Button";
import { navigate } from "../utils/navigation";

export default function EventScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const { event }: { event: Event } = route.params;
  const [coordinate, setCoordinate] = useState<any | null>(null);

  useEffect(() => {
    if (event.address) {
      fetchAdress();
    }
  }, []);

  async function fetchAdress(): Promise<void> {
    const c = await getCoordinate(event.address);
    setCoordinate(c);
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(event.address);
  };

  return (
    <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: event.image }} style={styles.image} />
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
            alignItems: "flex-start",
            marginBottom: 16
          }}
        >
          <Text style={[styles.title, { flex: 1 }]}>{event.title}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {event.reservations.length}/{event.nb_guests}
            </Text>
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
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{event.price}€</Text>
              <View style={{ height: "100%", width: 1, backgroundColor: "#000" }}></View>
              <Text style={{ fontSize: 16 }}>{format(new Date(event.date), "dd/MM")}</Text>
              <Calendar width={20} height={20} />
            </View>
          </View>

          <Text style={{ fontSize: 16 }}>{format(new Date(event.date), "HH'h'mm")}</Text>
        </View>

        <Text style={{ marginBottom: 24 }}>{event.description}</Text>

        <View style={styles.keyWordsContainer}>
          {event.key_words.split(",").map((kw, index) => (
            <View key={index} style={styles.keyWordItem}>
              <Text style={styles.keyWordItemText}>{kw}</Text>
            </View>
          ))}
        </View>

        {/* Adresse */}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}
          onPress={copyToClipboard}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 24 }}>{event.address}</Text>
        </TouchableOpacity>

        <MapView
          style={styles.map}
          region={{ ...coordinate, latitudeDelta: 0.003, longitudeDelta: 0.003 }}
        >
          <Marker coordinate={coordinate} />
        </MapView>

        <Button
          type="primary"
          label="Réservez votre événement !"
          onPress={() => navigate(navigation, "EventSummury", { event, coordinate })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 220,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden"
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
    overflow: "hidden"
  },
  userImg: {
    width: 60,
    height: 60,
    resizeMode: "cover"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8
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
  keyWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24
  },
  keyWordItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.secondary[100],
    borderRadius: 999
  },
  keyWordItemText: {
    color: theme.colors.secondary[800]
  },
  map: {
    width: "100%",
    height: 150,
    marginBottom: 24,
    borderRadius: 10
  }
});
