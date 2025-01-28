import { Customer } from "../entities/customer.entity";
import {
  CreateCustomerParams,
  ListCustomersParams,
  UpdateCustomerParams,
} from "../interfaces/customer.interface";

export interface CustomerRepository {
  list: (params: ListCustomersParams) => Promise<Array<Customer> | []>;
  create: (params: CreateCustomerParams) => Promise<Customer | null>;
  delete: (id: string) => Promise<void>;
  update: (params: UpdateCustomerParams) => Promise<Customer | null>;
  get: (id: string) => Promise<Customer | null>;
  getByDocument: (document: string) => Promise<Customer | null>;
}
