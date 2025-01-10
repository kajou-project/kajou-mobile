import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import theme from "../styles/theme";
import CameraSvg from "../assets/icons/camera.svg";
import * as ImagePicker from "expo-image-picker";
import Input from "../components/shared/Input";
import InputDate from "../components/shared/InputDate";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/shared/Button";

export default function AddMealScreen(): React.JSX.Element {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"]
      // allowsEditing: true,
      // aspect: [4, 3],
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <TouchableOpacity style={styles.choosePictureContainer} onPress={pickImage}>
            <CameraSvg />
            <Text style={styles.choosePictureText}>Ajouter une photo</Text>
          </TouchableOpacity>

          <View style={{ padding: 24 }}>
            <Input label="Le nom du repas" style={{ marginBottom: 24 }} />

            <View style={styles.inline}>
              <InputDate label="Date" type="date" />
              <InputDate label="Heure" type="time" />
            </View>

            <Input label="Description" style={{ marginBottom: 24 }} />

            <Input label="L'adresse" style={{ marginBottom: 24 }} />

            <View style={styles.inline}>
              <Input label="Les aliments" style={{ marginBottom: 24 }} />

              <Button type="secondary" label="Enregristrez le repas" />
            </View>

            <Button type="primary" label="Enregristrez le repas" />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  choosePictureContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 64,
    backgroundColor: theme.colors.gray.label
  },
  choosePictureText: {
    fontSize: 16,
    marginTop: 16
  },
  inline: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24
  }
});
