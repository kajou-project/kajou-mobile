import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { addHours, format } from "date-fns";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import { dispatch, navigate } from "../utils/navigation";
import { Category, useData } from "../contexts/DataContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { usePicture } from "../contexts/PictureContext";
import Checkbox from "../components/shared/Checkbox";

export default function AddMealScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { picture, setPicture } = usePicture();
  const { showActionSheetWithOptions } = useActionSheet();
  const { user, type } = useAuth();
  const { categories } = useData();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState<string>(format(addHours(new Date(), 1), "HH:mm"));
  const [guests, setGuests] = useState<number>(1);
  const [price, setPrice] = useState<string>("");
  const [food, setFood] = useState<string>("");
  const [foods, setFoods] = useState<string[]>([]);
  const [address, setAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [conditions, setConditions] = useState<boolean>(false);

  useEffect(() => {
    if (picture) {
      setImage(picture);
    }
  }, [picture]);

  const pickImage = (): void => {
    const options = ["Prendre une photo", "Sélectionner une image", "Annuler"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case 0:
            navigate(navigation, "Camera");
            break;

          case 1: {
            openImageLibrary();
            break;
          }

          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  /**
   * Pick an image from the gallery
   */
  async function openImageLibrary(): Promise<void> {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"]
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

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

    const file = await uploadFile(type === "particulier" ? "meal_posts" : "event_posts");

    if (!file) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi de l'image");
      return;
    }

    const formatedDate = new Date(`${date}T${time}`);

    if (type === "particulier") {
      const { data, error } = await supabase
        .from("meals")
        .insert([
          {
            title,
            description,
            date: formatedDate,
            nb_guests: guests,
            price: price ? +parseFloat(price.replace(",", ".")).toFixed(2) : null,
            address,
            image: file,
            foods: foods.join(","),
            category: category ?? null,
            user_id: user.id
          }
        ])
        .select();

      if (error || !data) {
        Alert.alert("Erreur", "Une erreur est survenue lors de la création du repas");
        return;
      }
    } else {
      const { error } = await supabase.from("events").insert([
        {
          title,
          description,
          date: formatedDate,
          nb_guests: guests,
          price: price ? +parseFloat(price.replace(",", ".")).toFixed(2) : null,
          address,
          image: file,
          key_words: foods.join(","),
          user_id: user.id
        }
      ]);

      if (error) {
        console.error("Event error: ", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la création de l'événement");
        return;
      }
    }

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
    setPrice("");
    setCategory("");
    setPicture(null);

    // Redirect to the home screen
    dispatch(navigation, "Home");
  }

  /**
   * Upload the file to Supabase
   * @returns
   */
  async function uploadFile(bucket: string): Promise<string | null> {
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
    const uniqueId = new Date().getTime();
    const fileName = `${uniqueId}_${image.split("/").pop()}`; // Récupérer le nom du fichier
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

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
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

  function selectCategory(c: Category): void {
    if (category === c.name) {
      setCategory("");
    } else {
      setCategory(c.name);
    }
  }

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
              label={`Le nom ${type === "particulier" ? "du repas" : "de l'événement"}`}
              placeholder={type === "particulier" ? "ex: Pizza" : "ex: Soirée méxicaine"}
              style={{ marginBottom: 24 }}
              onChangeText={setTitle}
            />

            {/* Catégories */}
            {type === "particulier" && (
              <View style={styles.categories}>
                {categories.map((c) => {
                  return (
                    <Pressable
                      key={c.name}
                      style={styles.category}
                      onPress={() => selectCategory(c)}
                    >
                      <View
                        style={category === c.name ? styles.categorySelected : styles.categoryIcon}
                      >
                        {category === c.name ? (
                          <c.iconSelected width={30} height={30} />
                        ) : (
                          <c.icon width={30} height={30} />
                        )}
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.categoryText}>{c.name}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

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

            <View style={[styles.inline, { alignItems: "flex-start" }]}>
              <View>
                <Text style={{ marginBottom: 12 }}>Nombre de personne</Text>
                <NumberSelect type="primary" min={1} onChangeNumber={setGuests} />
              </View>

              <Input
                label="Prix par personne"
                keyboardType="decimal-pad"
                placeholder="7€"
                containerStyle={{ flex: 1 }}
                onChangeText={setPrice}
              />
            </View>

            <Input
              label="Description"
              placeholder={
                type === "particulier"
                  ? "ex: Pizza 4 fromages"
                  : "Ex: Soirée méxicaine avec des maracas"
              }
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

            <View style={{ ...styles.inline, alignItems: "flex-end", marginBottom: 16 }}>
              <Input
                value={food}
                label={type === "particulier" ? "Les aliments" : "Mots clés"}
                placeholder={type === "particulier" ? "ex: Pomme" : "ex: Musique"}
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

            <Checkbox
              label="J’ai lu et j’accepte les conditions générales de ventes et d’hygiène."
              value={conditions}
              onChange={setConditions}
              style={{ marginBottom: 24 }}
            />

            <Button
              type="primary"
              label={`Enregistrer ${type === "particulier" ? "le repas" : "l'événement"}`}
              onPress={submit}
            />
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
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8
  },
  category: {
    alignItems: "center"
  },
  categorySelected: {
    borderRadius: 10,
    backgroundColor: theme.colors.secondary[500],
    padding: 16,
    aspectRatio: 1 / 1,
    width: 60,
    marginBottom: 6
  },
  categoryIcon: {
    borderRadius: 10,
    backgroundColor: theme.colors.secondary[100],
    padding: 16,
    aspectRatio: 1 / 1,
    width: 60,
    marginBottom: 6
  },
  categoryText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12
  },
  // Camera
  message: {
    textAlign: "center",
    paddingBottom: 10
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold"
  }
});
