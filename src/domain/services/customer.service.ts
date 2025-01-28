import { Customer } from "../entities/customer.entity";

import {
  CreateConsumerResponse,
  CreateCustomerParams,
  CustomerService as ICustomerService,
  ListCustomersParams,
  UpdateCustomerParams,
} from "../interfaces/customer.interface";
import { CustomerRepository } from "../repositories/customer.repository";

export class CustomerService implements ICustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async register(
    params: CreateCustomerParams
  ): Promise<CreateConsumerResponse> {
    console.log("CustomerService:: Register");

    try {
      const exists = await this.customerRepository.get(params.document);

      if (exists) throw new Error("Customer already exists");

      const response = await this.customerRepository.create(params);

      console.log("CustomerService:: Register :: Create Success");

      return { status: response?.status ?? null };
    } catch (error) {
      console.error("CustomerService:: Register :: Exception", error);

      throw error;
    }
  }

  async list(params: ListCustomersParams): Promise<Array<Customer>> {
    console.log("CustomerService:: List");

    try {
      const customers = await this.customerRepository.list(params);

      console.log("CustomerService:: List :: Success");

      return customers;
    } catch (error) {
      console.error("CustomerService:: List :: Exception", error);

      throw error;
    }
  }

  async get(id: string): Promise<Customer | null> {
    console.log("CustomerService:: Get");

    try {
      const customer = await this.customerRepository.get(id);

      console.log("CustomerService:: Get :: Success");

      return customer;
    } catch (error) {
      console.error("CustomerService:: Get :: Exception", error);

      throw error;
    }
  }

  async update(params: UpdateCustomerParams): Promise<Customer | null> {
    console.log("CustomerService:: Update");

    try {
      const customer = await this.customerRepository.update(params);

      console.log("CustomerService:: Update :: Success");

      return customer;
    } catch (error) {
      console.error("CustomerService:: Update :: Exception", error);

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    console.log("CustomerService:: Delete");

    try {
      await this.customerRepository.delete(id);

      console.log("CustomerService:: Delete :: Success");
    } catch (error) {
      console.error("CustomerService:: Delete :: Exception", error);

      throw error;
    }
  }
}
