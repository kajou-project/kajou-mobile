import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/supabase";
import { Event } from "../interfaces/Events.interface";
import ArrowRight from "../assets/icons/arrow-right.svg";
import theme from "../styles/theme";
import { format } from "date-fns";
import { navigate } from "../utils/navigation";

export default function EventsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

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

  useDynamicHeader();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tous les événements</Text>

      {events.map((event) => (
        <Pressable
          key={event.id}
          style={styles.event}
          onPress={() => navigate(navigation, "Event", { event })}
        >
          <View
            style={{
              width: "100%",
              height: 160,
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 8
            }}
          >
            <Image source={{ uri: event.image }} style={styles.image} />

            <View style={styles.opacity}>
              <View style={styles.userImgContainer}>
                <Image
                  source={require("../assets/images/louis-hansel-7qeQXRppR9o-unsplash.jpg")}
                  style={styles.userImg}
                />
              </View>

              <View style={styles.btn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Je m'inscris</Text>
                <ArrowRight width={18} height={18} />
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{event.title}</Text>
            <Text>{event.price}€</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text>{format(event.date, "dd/MM")}</Text>
            <View style={styles.round}></View>
            <Text>{format(event.date, "HH'h'mm")}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 24
  },
  event: {
    marginBottom: 24
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  opacity: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 16
  },
  userImgContainer: {
    borderRadius: 50,
    overflow: "hidden"
  },
  userImg: {
    width: 50,
    height: 50,
    resizeMode: "cover"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary[600],
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50
  },
  round: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000"
  }
});
