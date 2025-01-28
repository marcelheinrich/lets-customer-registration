import { CustomerStatus } from "../enums/customer.enum";

export interface Customer {
  id: string;
  fullName: string;
  birthDate: string;
  document: string;
  status: CustomerStatus;
  addresses: Array<Address>;
  contacts: Array<Contacts>;
  isDeleted: Boolean;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Contacts {
  phone: string;
  email: string;
  isMain: boolean;
}
