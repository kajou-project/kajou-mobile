import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Logo from "../assets/logo.svg";
import Curve from "../assets/curve.svg";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/supabase";
import InfosForm from "../components/sign-up/InfosForm";
import PasswordForm from "../components/sign-up/PasswordForm";
import { CompanySignUp, UserSignUp } from "../interfaces/User.interface";
import { User } from "@supabase/supabase-js";
import { dispatch } from "../utils/navigation";
import theme from "../styles/theme";

export default function SignUpScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserSignUp | CompanySignUp>({} as UserSignUp | CompanySignUp);
  const [next, setNext] = useState(false);

  function nextStep(data: object): void {
    setUser({ ...user, ...data });
    setNext(true);
  }

  async function submit(password: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password,
    });

    if (error || !data?.user) {
      Alert.alert("Erreur", error?.message ?? "Une erreur est survenue");
      return;
    }

    if (route.params.type === "particulier") {
      await createProfile(data.user);
    } else {
      await createCompany(data.user);
    }

    dispatch(navigation, "BottomTabs");
  }

  async function createProfile(supabaseUser: User): Promise<void> {
    if ("firstname" in user === false) {
      Alert.alert("Erreur", "Vous ne pouvez pas créer de profil particulier avec un compte professionnel");
      return;
    }

    const { error } = await supabase.from("profiles").insert([
      {
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        user_id: supabaseUser.id,
      },
    ]);

    if (error) {
      Alert.alert("Erreur", error.message);
      return;
    }
  }

  async function createCompany(supabaseUser: User): Promise<void> {
    if ("name" in user === false) {
      Alert.alert("Erreur", "Vous ne pouvez pas créer de compte professionnel avec un profil particulier");
      return;
    }

    const { error } = await supabase.from("companies").insert([
      {
        name: user.name,
        siret: user.siret,
        phone: user.phone,
        user_id: supabaseUser.id,
      },
    ]);

    if (error) {
      Alert.alert("Erreur", error.message);
      return;
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {next ? (
          // Second step
          <ScrollView style={styles.view}>
            <Curve width={396} height={404} style={styles.curve} />

            <Logo
              width={240}
              height={62}
              style={{ marginTop: 100, marginBottom: 48, alignSelf: "center" }}
            />

            <PasswordForm submit={submit} />
          </ScrollView>
        ) : (
          // First step
          <View style={styles.container}>
            <Curve width={396} height={404} style={styles.curve} />

            <Logo width={240} height={62} style={{ marginBottom: 100 }} />

            <InfosForm type={route.params.type} nextStep={nextStep} />
          </View>
        )}
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
    backgroundColor: theme.colors.white,
  },
  view: {
    width: "100%",
  },
  curve: {
    position: "absolute",
    top: -90,
    right: -110,
  },
});
