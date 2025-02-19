import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { useNavigation } from "@react-navigation/native";
import { dispatch } from "../../utils/navigation";
import { CompanySignUp, UserSignUp } from "../../interfaces/User.interface";

interface InfosProps {
  type: "particulier" | "professionnel";
  nextStep: Function;
}

export default function InfosForm(props: InfosProps): React.JSX.Element {
  const navigation = useNavigation();

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [siret, setSiret] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [siretError, setSiretError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  /** Vérifie les champs du formulaire */
  function validatteForm(): void {
    let isValid = true;

    // Vérification des champs
    if (!email) {
      setEmailError("L'adresse mail est obligatoire");
      isValid = false;
    }

    if (!phone) {
      setPhoneError("Le téléphone est obligatoire");
      isValid = false;
    }

    if (props.type === "particulier") {
      if (!firstname) {
        setFirstnameError("Le prénom est obligatoire");
        isValid = false;
      } else {
        setFirstnameError("");
      }

      if (!lastname) {
        setLastnameError("Le nom est obligatoire");
        isValid = false;
      } else {
        setLastnameError("");
      }
    } else {
      if (!name) {
        setNameError("La raison sociale est obligatoire");
        isValid = false;
      } else {
        setNameError("");
      }

      if (!siret) {
        setSiretError("Le SIRET est obligatoire");
        isValid = false;
      } else if (siret.length !== 14) {
        setSiretError("Le SIRET doit contenir 14 chiffres");
        isValid = false;
      } else {
        setSiretError("");
      }
    }

    // Arrêter la fonction si le formulaire n'est pas valide
    if (!isValid) {
      return;
    }

    // Envoi des données au composant parent
    if (props.type === "particulier") {
      props.nextStep({ firstname, lastname, email, phone } as UserSignUp);
    } else {
      props.nextStep({ name, siret: +siret, email, phone } as CompanySignUp);
    }
  }

  const onFirstnameChange = (text: string): void => {
    setFirstname(text);
    setFirstnameError("");
  };

  const onLastnameChange = (text: string): void => {
    setLastname(text);
    setLastnameError("");
  };

  const onNameChange = (text: string): void => {
    setName(text);
    setNameError("");
  };

  const onSiretChange = (text: string): void => {
    setSiret(text);
    setSiretError("");
  };

  const onEmailChange = (text: string): void => {
    setEmail(text);
    setEmailError("");
  };

  const onPhoneChange = (text: string): void => {
    setPhone(text);
    setPhoneError("");
  };

  return (
    <View style={styles.form}>
      {props.type === "particulier" ? (
        <View>
          <Input
            label="Prénom"
            placeholder="Jean"
            autoCorrect={false}
            containerStyle={{ marginBottom: 16 }}
            value={firstname}
            error={firstnameError}
            onChangeText={onFirstnameChange}
          />

          <Input
            label="Nom"
            placeholder="Dupont"
            autoCorrect={false}
            containerStyle={{ marginBottom: 16 }}
            value={lastname}
            error={lastnameError}
            onChangeText={onLastnameChange}
          />
        </View>
      ) : (
        <View>
          <Input
            label="Raison sociale"
            placeholder="Kajou"
            autoCorrect={false}
            containerStyle={{ marginBottom: 16 }}
            value={name}
            error={nameError}
            onChangeText={onNameChange}
          />

          <Input
            label="SIRET"
            placeholder="27654982645328"
            keyboardType="number-pad"
            autoCorrect={false}
            maxLength={14}
            containerStyle={{ marginBottom: 16 }}
            value={siret}
            error={siretError}
            onChangeText={onSiretChange}
          />
        </View>
      )}

      <Input
        label="Adresse mail"
        placeholder="jeandupont@gmail.com"
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={{ marginBottom: 16 }}
        value={email}
        error={emailError}
        onChangeText={onEmailChange}
      />

      <Input
        label="Téléphone"
        placeholder="06 12 34 56 78"
        autoCorrect={false}
        keyboardType="phone-pad"
        containerStyle={{ marginBottom: 24 }}
        value={phone}
        error={phoneError}
        onChangeText={onPhoneChange}
      />

      <Button type="primary" label="Continuer" onPress={validatteForm} />

      <Pressable style={styles.signUp} onPress={() => dispatch(navigation, "Login")}>
        <Text style={styles.signUpText}>Déjà un compte ? Connectez-vous</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    paddingHorizontal: 24
  },
  signUp: {
    marginTop: 8
  },
  signUpText: {
    textDecorationLine: "underline",
    textAlign: "center"
  }
});
