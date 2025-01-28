import { randomUUID } from "crypto";
import { CustomerStatus } from "../../src/domain/enums/customer.enum";

export const createCustomerMock = {
  fullName: "some_customer",
  birthDate: "2010-10-10",
  document: "43225062081",
  isDeleted: false,
  addresses: [
    {
      street: "some_street_around",
      number: "55",
      neighborhood: "some_neighborhood",
      city: "some_city",
      state: "some_state",
      postalCode: "some_postal",
    },
  ],
  contacts: [
    {
      phone: "5554991852395",
      isMain: true,
      email: "some_email@email.com",
    },
  ],
};

export const customerMock = {
  ...createCustomerMock,
  id: randomUUID(),
  status: CustomerStatus.ACTIVE,
};

export const listCustomersMock = {
  ids: ["some_id_1", "some_id_2"],
  search: "some_id_1",
  fullName: "some_customer",
  status: CustomerStatus.ACTIVE,
  addresses: [
    {
      street: "some_street_around",
      number: "55",
      neighborhood: "some_neighborhood",
      city: "some_city",
      state: "some_state",
      postalCode: "some_postal",
    },
  ],
};

export const listedCustomersMock = {
  id: "some_id_1",
  fullName: "some_customer",
  status: CustomerStatus.ACTIVE,
  birthDate: "2000-10-10",
  addresses: [
    {
      street: "some_street_around",
      number: "55",
      neighborhood: "some_neighborhood",
      city: "some_city",
      state: "some_state",
      postalCode: "some_postal",
    },
  ],
  contacts: [
    { phone: "123456789", email: "some_email@email.com", isMain: true },
  ],
  document: 'some_document',
  isDeleted: false
};

export const updateCustomerMock = {
  id: "some_id",
  status: CustomerStatus.INACTIVE,
};

export const dynamoMockResponse = {
  Items: [
    {
      id: { S: "1" },
      fullName: { S: "John Doe" },
      status: { S: "ACTIVE" },
      addresses: { S: JSON.stringify([{ street: "Street 1" }]) },
      contacts: { S: JSON.stringify([{ phone: "123456789" }]) },
      isDeleted: { BOOL: false },
    },
  ],
};

export const dynamoCreatingCustomer = {
  id: "1",
  fullName: "John Doe",
  status: CustomerStatus.ACTIVE,
  addresses: [{ street: "Street 1" }],
  contacts: [{ phone: "123456789" }],
  createdAt: "2025-01-26T00:00:00.000Z",
  updatedAt: "2025-01-26T00:00:00.000Z",
};

export const dynamoMockMappedResponse = {
  id: "1",
  fullName: "John Doe",
  status: CustomerStatus.ACTIVE,
  addresses: [{ street: "Street 1" }],
  contacts: [{ phone: "123456789" }],
};

export const dynamoUpdatingCustomer = {
  id: "1",
  status: CustomerStatus.INACTIVE,
  addresses: [
    {
      street: "some_street_around",
      number: "55",
      neighborhood: "some_neighborhood",
      city: "some_city",
      state: "some_state",
      postalCode: "some_postal",
    },
  ],
  contacts: [
    {
      phone: "5554991852395",
      isMain: true,
      email: "some_email@email.com",
    },
  ],
};

export const dynamoUpdatedCustomer = {
  id: "1",
  fullName: "John Doe",
  status: CustomerStatus.INACTIVE,
  addresses: [{ street: "Updated Street" }],
  contacts: [{ phone: "987654321" }],
  updatedAt: "2025-01-26T00:00:00.000Z",
};

export const dynamoListingCustomers = {
  search: "John",
  fullName: "John Doe",
  status: CustomerStatus.ACTIVE,
  ids: ["1"],
};

export const dynamoListedCustomers = {
  id: { S: "1" },
  fullName: { S: "John Doe" },
  status: { S: "ACTIVE" },
  addresses: { S: JSON.stringify([{ street: "Street 1" }]) },
  contacts: { S: JSON.stringify([{ phone: "123456789" }]) },
  isDeleted: { BOOL: false },
};
