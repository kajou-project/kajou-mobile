export interface UserSignUp {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface CompanySignUp {
  name: string;
  siret: number;
  email: string;
  phone: string;
}

export interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  siret: number;
  phone: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
