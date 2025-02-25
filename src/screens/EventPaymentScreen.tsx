import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Meal } from "../interfaces/Meals.interface";
import ArrowLeft from "../assets/icons/arrow-left-black.svg";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/shared/Input";
import theme from "../styles/theme";
import InputDate from "../components/shared/InputDate";
import Checkbox from "../components/shared/Checkbox";
import { useState } from "react";
import Button from "../components/shared/Button";
import { dispatch } from "../utils/navigation";
import { supabase } from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Event } from "../interfaces/Events.interface";

export default function EventPaymentScreen({ route }: { route: any }): React.JSX.Element {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { event, nbPeople, total }: { event: Event; nbPeople: number, total: number } = route.params;
  const [conditions, setConditions] = useState<boolean>(false);

  async function handlePayment(): Promise<void> {
    if (!user) {
      return Alert.alert("Erreur", "Vous devez être connecté pour réserver un repas.");
    }

    const { error } = await supabase.from("reservations").insert([
      {
        event_id: event.id,
        user_id: user.id,
        nb_people: nbPeople
      }
    ]);

    if (error) {
      console.log(error);
      return Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
    }

    Alert.alert("Paiement", "Votre réservation est confirmée !", [
      { text: "OK", onPress: () => dispatch(navigation, "BottomTabs") }
    ]);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <StatusBar style="dark" />

          <View style={{ padding: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <Pressable onPress={() => navigation.goBack()}>
                <ArrowLeft width={34} height={34} />
              </Pressable>
              <Text style={{ fontSize: 26, fontWeight: "bold" }}>Payez votre événement !</Text>
            </View>

            {/* Formulaire */}
            <Input
              label="Numéro de la carte"
              placeholder="64832764044883443"
              keyboardType="number-pad"
              style={styles.inputCustom}
              containerStyle={{ marginBottom: 24 }}
            />

            <View style={{ flexDirection: "row", gap: 24, marginBottom: 24 }}>
              <InputDate
                label="Date d’expiration"
                type="custom"
                format="MM/yy"
                style={styles.inputCustom}
              />
              <Input
                label="Cryptogramme"
                placeholder="546"
                keyboardType="number-pad"
                style={styles.inputCustom}
              />
            </View>

            <Input
              label="Nom sur la carte"
              placeholder="Jean Dupont"
              style={styles.inputCustom}
              containerStyle={{ marginBottom: 24 }}
            />

            <Checkbox
              label="J’ai lu et j’accepte les conditions générales de ventes."
              value={conditions}
              onChange={setConditions}
              style={{ marginBottom: 24 }}
            />

            {/* Line */}
            <View style={styles.line}></View>

            {/* Total */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: 600 }}>Total</Text>
              <Text style={{ fontSize: 26, fontWeight: 600 }}>{total}€</Text>
            </View>

            {/* Validation */}
            <Button type="primary" label="Validez le paiement" onPress={handlePayment} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputCustom: {
    borderWidth: 0,
    backgroundColor: theme.colors.gray[1]
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.colors.secondary[400],
    marginBottom: 24
  }
});
