import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://czibukajxyhaoykymaey.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aWJ1a2FqeHloYW95a3ltYWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzOTAzMzQsImV4cCI6MjA0Mzk2NjMzNH0.c5TMAUmxKl8TxCqp_urqtEHXmN3T_EtG2A2eeD0WMQ4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
