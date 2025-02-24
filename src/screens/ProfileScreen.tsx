import { Pressable, StyleSheet, Text, View } from "react-native";
import { supabase } from "../utils/supabase";
import { dispatch, navigate } from "../utils/navigation";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/shared/Button";
import ArrowLeft from "../assets/icons/chevron-left.svg";
import ArrowRight from "../assets/icons/chevron-right.svg";
import ArrowRightWhite from "../assets/icons/chevron-right-white.svg";
import theme from "../styles/theme";
import User from "../assets/icons/user.svg";
import { useAuth } from "../contexts/AuthContext";
import Kajou from "../assets/icons/resa-bold.svg";
import { StatusBar } from "expo-status-bar";

export default function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { profile, company } = useAuth();

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    dispatch(navigation, "Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 64
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft width={28} height={28} />
        </Pressable>

        <Text style={{ fontSize: 26, fontWeight: "bold" }}>Mon compte</Text>

        <View style={{ width: 28 }}></View>
      </View>

      {/* Compte */}
      <View style={styles.accountCard}>
        <View style={styles.imgContainer}>
          <User width={24} height={24} />
        </View>

        <Text style={styles.accountName}>{profile?.firstname ?? company?.name}</Text>

        <ArrowRight width={24} height={24} />
      </View>

      {/* Repas */}
      <Pressable style={styles.mealsCard} onPress={() => navigate(navigation, "MyMeals")}>
        <Kajou width={48} height={48} />
        <Text style={styles.mealsText}>Vos repas</Text>
        <ArrowRightWhite width={24} height={24} />
      </Pressable>

      <Button type="primary" label="Se déconnecter" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64
  },
  imgContainer: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: theme.colors.secondary[400],
    justifyContent: "center",
    alignItems: "center"
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 48,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary[100],
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
  },
  accountName: {
    flex: 1,
    color: theme.colors.secondary[500],
    fontSize: 24,
    fontWeight: "bold"
  },
  mealsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 48,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary[400]
  },
  mealsText: {
    flex: 1,
    fontSize: 26,
    fontWeight: "bold",
    color: "white"
  }
});
