import { StyleSheet, View } from "react-native";
import { supabase } from "../utils/supabase";
import { dispatch } from "../utils/navigation";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/shared/Button";

export default function Profile(): React.JSX.Element {
  const navigation = useNavigation();

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    dispatch(navigation, "Login");
  };

  return (
    <View style={styles.container}>
      <Button type="primary" label="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
