import React, { useEffect, useState } from "react";
import LocationContext from "../contexts/LocationContext";
import { LocationGeocodedAddress, LocationObject } from "expo-location";
import * as Location from "expo-location";

export function LocationProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [addresses, setAddresses] = useState<LocationGeocodedAddress[]>([]);

  useEffect(() => {
    const getCurrentLocation = async (): Promise<void> => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission de localisation non accordée.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const { coords } = location;
      const { latitude, longitude } = coords;
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverse) {
        setAddresses(reverse);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, addresses }}>{children}</LocationContext.Provider>
  );
}
