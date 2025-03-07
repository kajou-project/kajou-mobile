import { useState } from "react";
import PictureContext from "../contexts/PictureContext";

export function PictureProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [picture, setPicture] = useState<string | null>(null);

  return (
    <PictureContext.Provider value={{ picture, setPicture }}>{children}</PictureContext.Provider>
  );
}
