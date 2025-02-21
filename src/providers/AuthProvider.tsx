import { useEffect, useState } from "react";
import AuthContext, { AuthContextType } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import { User } from "@supabase/supabase-js";
import { Company, Profile } from "../interfaces/User.interface";

export function AuthProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [type, setType] = useState<"particulier" | "professionnel" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /** Fonction qui va charger/rafraîchir le profil depuis la table 'profiles' */
  async function refreshProfile(): Promise<void> {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erreur refreshProfile:", error);
      }

      setProfile(data);
    } catch (err) {
      console.error("Erreur inconnue:", err);
    }
  }

  /** Fonction qui va charger/rafraîchir la compagnie depuis la table 'companies' */
  async function refreshCompany(): Promise<void> {
    if (!user) {
      setCompany(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erreur refreshCompany:", error);
      }

      setCompany(data);
    } catch (err) {
      console.error("Erreur inconnue:", err);
    }
  }

  async function refresh(): Promise<void> {
    await Promise.all([refreshProfile(), refreshCompany()]);

    if (profile && !company) {
      setType("particulier");
    }

    if (company && !profile) {
      setType("professionnel");
    }
  }

  // Au montage, on récupère la session / user actuel
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error(error);
      }

      if (mounted) {
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await refresh();
      } else {
        setProfile(null);
        setCompany(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    profile,
    company,
    type,
    loading,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
