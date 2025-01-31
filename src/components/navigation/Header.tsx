import { StatusBar, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";
import Bell from "../../assets/icons/bell.svg";
import MapPin from "../../assets/icons/map-pin.svg";

interface Props {
  city: string | null;
}

export default function Header({ city }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      {city ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <MapPin />
          <Text style={styles.title}>{city}</Text>
        </View>
      ) : (
        <Text></Text>
      )}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.iconContainer}>
          <Bell />
        </View>

        <View style={styles.imgContainer}>{/* User Icon */}</View>
      </View>

      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.colors.primary[600],
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20
  },
  iconContainer: {
    width: 35,
    height: 35,
    marginRight: 20,
    borderRadius: 999,
    backgroundColor: theme.colors.primary[100],
    justifyContent: "center",
    alignItems: "center"
  },
  imgContainer: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: theme.colors.primary[200],
    justifyContent: "center",
    alignItems: "center"
  }
});
