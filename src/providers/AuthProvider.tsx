import React, { useEffect, useState } from "react";
import AuthContext, { AuthContextType } from "../contexts/AuthContext";
import { supabase } from "../utils/supabase";
import { User } from "@supabase/supabase-js";
import { Profile } from "../interfaces/User.interface";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction qui va charger/rafraîchir le profil depuis la table 'profiles'
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
      if (error) {
        console.error("Erreur refreshProfile:", error);
      }
      setProfile(data);
    } catch (err) {
      console.error("Erreur inconnue:", err);
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

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await refreshProfile();
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
