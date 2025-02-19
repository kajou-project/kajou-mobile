import { StyleSheet, Text, View } from "react-native";
import theme from "../styles/theme";
import Logo from "../assets/logo.svg";
import Curve from "../assets/curve.svg";
import Button from "../components/shared/Button";
import { useNavigation } from "@react-navigation/native";
import { dispatch } from "../utils/navigation";

export default function BeforeSignUp(): React.JSX.Element {
  const navigation = useNavigation();

  const goToSignUp = (type: string): void => {
    dispatch(navigation, "SignUp", { type });
  };

  return (
    <View style={styles.container}>
      <Curve width={396} height={404} style={styles.curve} />
      <Logo width={240} height={62} style={{ marginBottom: 100 }} />

      <View style={styles.buttons}>
        <Button type="primary" label="Je suis un particulier" onPress={() => goToSignUp("particulier")} />
        <Button type="secondaryOutline" label="Je suis un professionnel" onPress={() => goToSignUp("professionnel")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white
  },
  curve: {
    position: "absolute",
    top: -90,
    right: -110
  },
  buttons: {
    flexDirection: "column",
    gap: 24
  }
});
