import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Logo from "../assets/logo.svg";
import Curve from "../assets/curve.svg";
import Input from "../components/shared/Input";
import InputPassword from "../components/shared/InputPassword";
import Button from "../components/shared/Button";
import { useNavigation } from "@react-navigation/native";
import { dispatch } from "../utils/navigation";
import { supabase } from "../utils/supabase";

export default function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Erreur", error.message);
      return;
    }

    dispatch(navigation, "BottomTabs");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Curve width={396} height={404} style={styles.curve} />

          <Logo width={240} height={62} style={{ marginBottom: 100 }} />

          <View style={styles.form}>
            <Input
              label="Adresse mail"
              placeholder="jeandupont@gmail.com"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginBottom: 24 }}
              value={email}
              onChangeText={setEmail}
            />

            <InputPassword
              label="Mot de passe"
              placeholder="Mot de passe"
              style={{ marginBottom: 16 }}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.underline}>Mot de passe oublié ?</Text>
            </Pressable>

            <Button type="primary" label="Se connecter" onPress={submit} />

            <Pressable
              style={styles.signUp}
              onPress={() => dispatch(navigation, "SignUp")}
            >
              <Text style={styles.signUpText}>
                Pas encore de compte ? Inscrivez-vous
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  curve: {
    position: "absolute",
    top: -90,
    right: -110,
  },
  form: {
    width: "100%",
    paddingHorizontal: 24,
  },
  underline: {
    textDecorationLine: "underline",
  },
  forgotPassword: {
    marginBottom: 24,
  },
  signUp: {
    marginTop: 8,
  },
  signUpText: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
