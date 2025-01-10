import { StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";
import Bell from "../../assets/icons/bell.svg";

export default function Header(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.iconContainer}>
          <Bell />
        </View>

        <View style={styles.imgContainer}>{/* User Icon */}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.colors.main[600],
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
  },
  iconContainer: {
    width: 35,
    height: 35,
    marginRight: 20,
    borderRadius: 999,
    backgroundColor: theme.colors.main[100],
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: theme.colors.main[200],
    justifyContent: "center",
    alignItems: "center",
  },
});
