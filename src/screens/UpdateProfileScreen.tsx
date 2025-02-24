import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ArrowLeft from "../assets/icons/chevron-left.svg";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function UpdateProfileScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user, profile, refresh } = useAuth();

  const [firstname, setFirstname] = useState(profile?.firstname ?? "");
  const [lastname, setLastname] = useState(profile?.lastname ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  async function updateProfile(): Promise<void> {
    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        firstname,
        lastname,
        phone
      })
      .eq("user_id", user.id);

    if (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour de votre profil.");
      return;
    }

    refresh();
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
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

        <Text style={{ fontSize: 26, fontWeight: "bold" }}>Modifier le profil</Text>

        <View style={{ width: 28 }}></View>
      </View>

      {/* Infos */}
      <Input
        value={firstname}
        label="Prénom"
        placeholder="Joe"
        style={{ marginBottom: 24 }}
        onChangeText={setFirstname}
      />
      <Input
        value={lastname}
        label="Nom"
        placeholder="Doe"
        style={{ marginBottom: 24 }}
        onChangeText={setLastname}
      />
      <Input
        value={phone}
        label="Téléphone"
        placeholder="0678948746"
        maxLength={10}
        style={{ marginBottom: 24 }}
        onChangeText={setPhone}
      />

      <Button type="primary" label="Enregistrer" onPress={() => updateProfile()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64
  }
});
