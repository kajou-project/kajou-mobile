import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Meal } from "../interfaces/Meals.interface";
import ArrowLeft from "../assets/icons/arrow-left-black.svg";
import { useEffect, useState } from "react";
import theme from "../styles/theme";
import NumberSelect from "../components/shared/NumberSelect";
import MapView, { Marker } from "react-native-maps";
import ArrowRight from "../assets/icons/arrow_right-black.svg";
import MapPin from "../assets/icons/map-pin-black.svg";
import Phone from "../assets/icons/phone.svg";
import Clock from "../assets/icons/clock-black.svg";
import { format } from "date-fns";
import Button from "../components/shared/Button";
import { StatusBar } from "expo-status-bar";
import { navigate } from "../utils/navigation";
import { Event } from "../interfaces/Events.interface";

export default function EventSummuryScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const { event, coordinate }: { event: Event; coordinate: any } = route.params;
  const [total, setTotal] = useState<number>(event.price);
  const [nbPeople, setNbPeople] = useState<number>(1);
  const [splitAddress, setSplitAddress] = useState<Record<string, string>>({
    street: "",
    city: ""
  });

  const handleIncrement = (nbPeople: number): void => {
    setNbPeople(nbPeople);
    setTotal(event.price * nbPeople);
  };

  const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  };

  useEffect(() => {
    if (event.address) {
      const regex = /(.*)\s(\d{5}\s.+)/; // Capture tout avant le code postal et tout après
      const match = event.address.match(regex);

      if (match) {
        setSplitAddress({
          street: match[1],
          city: match[2]
        });
      } else {
        setSplitAddress({ street: event.address, city: "" });
      }
    }
  }, []);

  return (
    <SafeAreaView>
      <StatusBar style="dark" />

      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft width={34} height={34} />
          </Pressable>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>Validez votre Kajou !</Text>
        </View>

        {/* Card */}
        <View style={styles.recommendation}>
          <Image source={{ uri: event.image }} style={styles.recoImg} />

          <View style={styles.recoContainer}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>{event.title}</Text>

              <Text style={{ marginBottom: 8 }}>Chez {event.owner.name}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text>Nombre de personne</Text>
                <NumberSelect
                  type="secondary"
                  min={1}
                  max={event.nb_guests - event.reservations.length}
                  onChangeNumber={handleIncrement}
                />
              </View>
          </View>
        </View>

        {/* Line */}
        <View style={styles.line}></View>

        {/* Prix */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: 600 }}>Sous-total</Text>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>{total}€</Text>
        </View>

        {/* Map */}
        <MapView
          style={styles.map}
          region={{ ...coordinate, latitudeDelta: 0.003, longitudeDelta: 0.003 }}
        >
          <Marker coordinate={coordinate} />
        </MapView>

        {/* Adresse */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <MapPin width={24} height={24} />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{splitAddress.street}</Text>
                <Text>{splitAddress.city}</Text>
              </View>

              <ArrowRight width={32} height={32} />
            </View>

            <View style={{ width: "100%", height: 1, backgroundColor: "#CCC" }}></View>
          </View>
        </View>

        {/* Le bigo */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <Phone width={24} height={24} />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {formatPhone(event.owner.phone)}
              </Text>

              <ArrowRight width={32} height={32} />
            </View>

            <View style={{ width: "100%", height: 1, backgroundColor: "#CCC" }}></View>
          </View>
        </View>

        {/* Heure */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
          <Clock width={24} height={24} />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Heure</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {format(new Date(event.date), "HH'h'mm")}
              </Text>
            </View>

            <View style={{ width: "100%", height: 1, backgroundColor: "#CCC" }}></View>
          </View>
        </View>

        {/* Validation */}
        <Button
          type="primary"
          label="Réservez votre événement !"
          onPress={() => navigate(navigation, "EventPayment", { event, nbPeople, total })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recommendations: {
    marginHorizontal: 24,
    gap: 16
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
    flexDirection: "column",
    paddingHorizontal: 16
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginTop: 16,
    marginBottom: 24
  },
  map: {
    width: "100%",
    height: 150,
    marginBottom: 24,
    borderRadius: 10
  }
});
