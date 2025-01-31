import { Image, StyleSheet, Text, View } from "react-native";
import theme from "../styles/theme";
import Logo from "../assets/logo-2-blanc.svg";

export default function SplashScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/images/oh-les-gourmands.jpg")} />
      <View style={styles.opacity}>
        <Logo width={250} height={250} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  }
});
