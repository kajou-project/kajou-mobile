import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../utils/supabase";
import Button from "../components/shared/Button";
import { dispatch } from "../utils/navigation";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user, profile, loading } = useAuth();

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    dispatch(navigation, "Login");
  };

  useDynamicHeader();

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}

      {user && profile && (
        <View>
          <Text>
            {profile.firstname} {profile.lastname}
          </Text>
          <Text>{user.email}</Text>

          <Button label="Logout" type="primary" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
