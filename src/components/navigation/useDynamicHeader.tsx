import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import { useLocation } from "../../contexts/LocationContext";

export function useDynamicHeader() {
  const { addresses } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header city={addresses.length > 0 ? addresses[0].city : null} />,
    });
  }, [addresses, navigation]);
}
