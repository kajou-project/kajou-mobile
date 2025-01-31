import { LocationGeocodedAddress, LocationObject } from "expo-location";
import { createContext, useContext } from "react";

export interface LocationContextType {
  location: LocationObject | null;
  addresses: LocationGeocodedAddress[];
}

const LocationContext = createContext({
  location: null,
  addresses: []
} as LocationContextType);

export const useLocation = () => useContext(LocationContext);

export default LocationContext;
