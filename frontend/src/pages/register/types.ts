export type Gender = "feminino" | "masculino" | "outro" | "prefiro nao dizer";

export type RegisterStep1Data = {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};
