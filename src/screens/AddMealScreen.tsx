import React, { useCallback, useState } from "react";
import {
  Image,
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
import Plus from "../assets/icons/plus.svg";
import Cross from "../assets/icons/cross.svg";
import NumberSelect from "../components/shared/NumberSelect";
import { searchAddress } from "../services/address-gouv";
import _ from "lodash";
import { useDynamicHeader } from "../components/navigation/useDynamicHeader";
import { supabase } from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import { dispatch } from "../utils/navigation";

export default function AddMealScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);

  const [food, setFood] = useState<string>("");
  const [foods, setFoods] = useState<string[]>([]);

  const [address, setAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Pick an image from the gallery
   */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"]
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /**
   * Fetch addresses from the API
   * @param {string} query - The query to search
   */
  async function fetchAddresses(query: string): Promise<void> {
    const addresses = await searchAddress(query);
    setAddresses(addresses);
  }

  /**
   * Debounce the search function
   */
  const debouncedSearch = useCallback(_.debounce(fetchAddresses, 500), []);

  /**
   * Handle the input change
   * @param {string} text - The input text
   */
  const handleInputChange = (text: string): void => {
    setAddress(text);
    debouncedSearch(text);
  };

  /**
   * Select an address from the list
   * @param {string} address - The selected address
   */
  const selectAddress = (address: string): void => {
    setAddress(address);
    setAddresses([]);
  };

  /**
   * Add a food to the list
   */
  const addFood = (): void => {
    if (food) {
      setFoods([...foods, food.trim()]);
      setFood("");
    }
  };

  /**
   * Submit the form
   * @returns
   */
  async function submit(): Promise<void> {
    if (!user) {
      return;
    }

    const file = await uploadFile();

    if (!file) {
      return;
    }

    const formatedDate = new Date(`${format(date, "yyyy-MM-dd")}T${format(time, "HH:mm")}`);

    const { data, error } = await supabase
      .from("meals")
      .insert([
        {
          title,
          description,
          date: formatedDate,
          nb_guests: guests,
          address,
          image: file,
          user_id: user.id
        }
      ])
      .select();

    if (error || !data) {
      console.error("Error creating meal:", error);
      return;
    }

    addMealFoods(data[0].id);

    // Clear the form
    setImage(null);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setGuests(1);
    setFood("");
    setFoods([]);
    setAddress("");
    setAddresses([]);

    // Redirect to the home screen
    dispatch(navigation, "Home");
  }

  /**
   * Upload the file to Supabase
   * @returns
   */
  async function uploadFile(): Promise<string | null> {
    if (!image) {
      return null;
    }

    // Lire le fichier en binaire
    const fileInfo = await FileSystem.getInfoAsync(image);
    if (!fileInfo.exists) {
      console.error("Le fichier n'existe pas !");
      return null;
    }

    // Définir le chemin de stockage sur Supabase
    const fileName = image.split("/").pop(); // Récupérer le nom du fichier
    // const filePath = `public/${fileName}`;
    const filePath = `public/${user!.id}/${fileName}`;
    const fileType = fileName!.split(".").pop(); // Récupérer l'extension du fichier

    // Lire le fichier en base64
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: FileSystem.EncodingType.Base64
    });

    // Convertir base64 en Uint8Array
    const binary = atob(base64); // Décoder en binaire
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    const { data, error } = await supabase.storage.from("meal_posts").upload(filePath, buffer, {
      contentType: typeImage(fileType),
      cacheControl: "3600",
      upsert: false
    });

    if (error || !data) {
      console.error("Error uploading file:", error);
      return null;
    }

    return data.path;
  }

  /**
   * Add meal foods
   * @param {number} mealId - The meal ID
   */
  async function addMealFoods(mealId: number): Promise<void> {
    const { error } = await supabase.from("meal_foods").insert([
      ...foods.map((food) => ({
        meal_id: mealId,
        name: food
      }))
    ]);

    if (error) {
      console.error("Error adding meal foods:", error);
    }
  }

  /**
   * Get the image type
   * @param {string} ext - The image extension
   * @returns
   */
  const typeImage = (ext: string | undefined): string => {
    switch (ext) {
      case "jpg":
        return "image/jpeg";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return "image/jpeg";
    }
  };

  useDynamicHeader();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{ marginTop: -20 }} automaticallyAdjustKeyboardInsets={true}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: "100%", height: 270 }} />
            ) : (
              <View style={styles.choosePictureContainer}>
                <CameraSvg />
                <Text style={styles.choosePictureText}>Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{ padding: 24 }}>
            <Input
              label="Le nom du repas"
              placeholder="ex: Pizza"
              style={{ marginBottom: 24 }}
              onChangeText={setTitle}
            />

            <View style={styles.inline}>
              <InputDate
                label="Date"
                type="date"
                containerStyle={{ flex: 1 }}
                onChangeDate={setDate}
              />
              <InputDate
                label="Heure"
                type="time"
                containerStyle={{ flex: 1 }}
                onChangeDate={setTime}
              />
            </View>

            <Text style={{ marginBottom: 12 }}>Nombre de personne</Text>
            <NumberSelect
              type="primary"
              min={1}
              style={{ marginBottom: 24 }}
              onChangeNumber={setGuests}
            />

            <Input
              label="Description"
              placeholder="ex: Pizza 4 fromages"
              style={{ marginBottom: 24 }}
              onChangeText={setDescription}
            />

            <Input
              value={address}
              label="L'adresse"
              placeholder="ex: 1 rue de Paris"
              style={{ marginBottom: 16 }}
              onChangeText={handleInputChange}
            />

            <View style={{ marginBottom: 24, gap: 8 }}>
              {addresses.map((address, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.addressItem}
                  onPress={() => selectAddress(address)}
                >
                  <Text>{address}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ ...styles.inline, marginBottom: 16 }}>
              <Input
                value={food}
                label="Les aliments"
                placeholder="ex: Pomme"
                containerStyle={{ flex: 1 }}
                onChangeText={setFood}
              />

              <Button
                type="secondary"
                icon={<Plus />}
                style={{ paddingHorizontal: 12 }}
                onPress={addFood}
              />
            </View>

            <View style={styles.foodsContainer}>
              {foods.map((food, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text style={styles.foodItemText}>{food}</Text>
                  <Cross width={14} height={14} />
                </View>
              ))}
            </View>

            <Button type="primary" label="Enregristrez le repas" onPress={submit} />
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
    height: 270,
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
    alignItems: "flex-end",
    gap: 16,
    marginBottom: 24
  },
  addressItem: {
    padding: 8,
    backgroundColor: theme.colors.gray.label,
    borderRadius: 8,
    gap: 8
  },
  foodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24
  },
  foodItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.secondary[200],
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  foodItemText: {
    color: theme.colors.secondary[800]
  }
});
