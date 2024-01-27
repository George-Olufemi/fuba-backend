type address = {
  country: string;
  postalCode: string;
  state: string;
};

export interface editProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  address?: address;
}
