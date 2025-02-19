import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { Company, Profile } from "../interfaces/User.interface";

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
  refreshProfile: () => void;
}

// On définit la forme de nos données
const AuthContext = createContext({
  user: null,
  profile: null,
  company: null,
  loading: true,
  refreshProfile: () => {}
} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
