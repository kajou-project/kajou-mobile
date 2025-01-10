import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputPassword from "../shared/InputPassword";
import Button from "../shared/Button";
import { useNavigation } from "@react-navigation/native";
import CircleXmark from "../../assets/icons/circle-xmark.svg";
import CircleCheck from "../../assets/icons/circle-check.svg";
import { dispatch } from "../../utils/navigation";
import Checkbox from "../shared/Checkbox";

interface PasswordProps {
  submit: Function;
}

export default function PasswordForm(props: PasswordProps): React.JSX.Element {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [criteria, setCriteria] = useState([
    {
      name: "caracters",
      regex: /.{8,}/,
      message: "Au moins 8 caractères",
      isValid: false,
    },
    {
      name: "uppercase",
      regex: /[A-Z]/,
      message: "Au moins 1 majuscule",
      isValid: false,
    },
    {
      name: "lowercase",
      regex: /[a-z]/,
      message: "Au moins 1 minuscule",
      isValid: false,
    },
    {
      name: "number",
      regex: /\d/,
      message: "Au moins 1 chiffre",
      isValid: false,
    },
    {
      name: "special",
      regex: /[~!@#$%^*()-_=+\[\]{};:,./?]/,
      message: "Au moins 1 caractère spécial",
      isValid: false,
    },
  ]);
  const [conditions, setConditions] = useState(false);

  function checkCriteria(value: string) {
    setPassword(value);

    const newCriteria = criteria.map((criterion) => {
      return {
        ...criterion,
        isValid: criterion.regex.test(password),
      };
    });

    setCriteria(newCriteria);
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Définir un mot de passe</Text>

      <InputPassword
        label="Mot de passe"
        placeholder="Mot de passe"
        style={{ marginBottom: 16 }}
        value={password}
        onChangeText={checkCriteria}
      />

      <InputPassword
        label="Confirmation du mot de passe"
        placeholder="Mot de passe"
        style={{ marginBottom: 24 }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={styles.subTitle}>Le mot de passe doit contenir :</Text>

      {criteria.map((criterion) => {
        const isValid = criterion.regex.test(password);

        return (
          <View style={styles.criteria} key={criterion.name}>
            {isValid ? <CircleCheck /> : <CircleXmark />}
            <Text>{criterion.message}</Text>
          </View>
        );
      })}

      <TouchableOpacity>
        <Text style={styles.textContainer}>
          <Text>
            Pour valider la création de votre compte, vous devez accepter{" "}
          </Text>
          <Text style={styles.link}>
            les conditions générales d’utilisation
          </Text>
          <Text>.</Text>
        </Text>
      </TouchableOpacity>

      <Checkbox
        label="J'accepte les conditions générales d’utilisation"
        value={conditions}
        onChange={setConditions}
        style={{ marginBottom: 16 }}
      />

      <Button
        type="primary"
        label="Inscrivez - vous !"
        disabled={
          criteria.some((criterion) => !criterion.isValid) || !conditions
        }
        onPress={() => props.submit(password)}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    paddingHorizontal: 24,
  },
  subTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  criteria: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  signUp: {
    marginTop: 8,
    marginBottom: 48,
  },
  signUpText: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
  textContainer: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  link: {
    textDecorationLine: "underline",
  },
});
