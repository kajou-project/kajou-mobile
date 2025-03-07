import { createContext, useContext } from "react";

export interface PictureContextType {
  picture: string | null;
  setPicture: (picture: string | null) => void;
}

const PictureContext = createContext({
  picture: null,
  setPicture: () => {}
} as PictureContextType);

export const usePicture = () => useContext(PictureContext);

export default PictureContext;
