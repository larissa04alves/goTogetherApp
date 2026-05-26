export type Gender = "female" | "male" | "other" | "prefer_not_to_say";

export type RegisterStep1Data = {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};
