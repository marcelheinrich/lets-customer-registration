import { Address, Contacts, Customer } from "../entities/customer.entity";
import { CustomerStatus } from "../enums/customer.enum";

export interface CustomerService {
  register: (params: CreateCustomerParams) => Promise<CreateConsumerResponse>;
  get: (id: string) => Promise<Customer | null>;
  list: (params: ListCustomersParams) => Promise<Array<Customer>>;
  update: (params: UpdateCustomerParams) => Promise<Customer | null>;
  delete: (id: string) => Promise<void>;
}

export interface CreateCustomerParams {
  id?: string;
  fullName: string;
  birthDate: string;
  document: string;
  addresses: Array<Address>;
  contacts: Array<Contacts>;
}

export interface CreateConsumerResponse {
  status: string | null;
}

export interface ListCustomersParams {
  search?: string;
  fullName?: string;
  status?: CustomerStatus;
  addresses?: Array<Address>;
  ids?: Array<string>;
  document?: string;
}

export interface UpdateCustomerParams {
  id: string;
  status?: CustomerStatus;
  addresses?: Array<Address>;
  contacts?: Array<Contacts>;
}
