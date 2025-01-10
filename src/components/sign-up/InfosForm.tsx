import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { useNavigation } from "@react-navigation/native";
import { dispatch } from "../../utils/navigation";

interface InfosProps {
  nextStep: Function;
}

export default function InfosForm(props: InfosProps): React.JSX.Element {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.form}>
      <Input
        label="Prénom"
        placeholder="Jean"
        autoCorrect={false}
        style={{ marginBottom: 16 }}
        value={firstname}
        onChangeText={setFirstname}
      />

      <Input
        label="Nom"
        placeholder="Dupont"
        autoCorrect={false}
        style={{ marginBottom: 16 }}
        value={lastname}
        onChangeText={setLastname}
      />

      <Input
        label="Adresse mail"
        placeholder="jeandupont@gmail.com"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
        value={email}
        onChangeText={setEmail}
      />

      <Input
        label="Téléphone"
        placeholder="06 12 34 56 78"
        autoCorrect={false}
        keyboardType="phone-pad"
        style={{ marginBottom: 24 }}
        value={phone}
        onChangeText={setPhone}
      />

      <Button
        type="primary"
        label="Continuer"
        onPress={() => props.nextStep({ firstname, lastname, email, phone })}
      />

      <Pressable
        style={styles.signUp}
        onPress={() => dispatch(navigation, "Login")}
      >
        <Text style={styles.signUpText}>Déjà un compte ? Connectez-vous</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    paddingHorizontal: 24,
  },
  signUp: {
    marginTop: 8,
  },
  signUpText: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
