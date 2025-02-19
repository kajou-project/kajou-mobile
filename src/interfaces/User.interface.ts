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
  firstname: string;
  lastname: string;
  phone: string;
}

export interface Company {
  name: string;
  siret: number;
  phone: string;
}
