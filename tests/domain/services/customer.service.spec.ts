import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CustomerService } from "../../../src/domain/services/customer.service";
import { DynamoCustomerRepository } from "../../../src/infra/dynamo-customer-repository";
import {
  createCustomerMock,
  customerMock,
  listCustomersMock,
  updateCustomerMock,
} from "../../mocks/customer.mock";
import { CustomerStatus } from "../../../src/domain/enums/customer.enum";

jest.mock("../../../src/infra/dynamo-customer-repository");
jest.mock("@aws-sdk/client-dynamodb");

describe("CustomerServiceClass", () => {
  let sut: CustomerService;
  let repository: jest.Mocked<DynamoCustomerRepository>;
  let client: jest.Mocked<DynamoDBClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    client = new DynamoDBClient({}) as jest.Mocked<DynamoDBClient>;

    repository = new DynamoCustomerRepository(
      client
    ) as jest.Mocked<DynamoCustomerRepository>;

    sut = new CustomerService(repository);
  });

  describe("Create Customer Register Function", () => {
    it("Should throw an Error when an exception was catched", async () => {
      jest
        .spyOn(repository, "create")
        .mockRejectedValue(new Error("some_error"));

      const promise = sut.register(createCustomerMock);

      await expect(promise).rejects.toThrow("some_error");
    });

    it('Should throw an error when the customer already exists', async () => {
      jest.spyOn(repository, "get").mockResolvedValue(customerMock);

      const promise = sut.register(createCustomerMock);

      await expect(promise).rejects.toThrow("Customer already exists");
    })

    it("Should create a new Customer with null response", async () => {
      jest.spyOn(repository, "create").mockResolvedValue(null);

      const actual = await sut.register(createCustomerMock);

      expect(actual).toStrictEqual({ status: null });
    });

    it("Should create a new Customer", async () => {
      jest.spyOn(repository, "create").mockResolvedValue(customerMock);

      const actual = await sut.register(createCustomerMock);

      expect(actual).toStrictEqual({ status: CustomerStatus.ACTIVE });
    });
  });

  describe("List Customers Function", () => {
    it("Should throw an Error when an exception was catched", async () => {
      jest.spyOn(repository, "list").mockRejectedValue(new Error("some_error"));

      const promise = sut.list(listCustomersMock);

      await expect(promise).rejects.toThrow("some_error");
    });

    it("Should list Customers", async () => {
      jest.spyOn(repository, "list").mockResolvedValue([customerMock]);

      const actual = await sut.list(listCustomersMock);

      expect(actual).toStrictEqual([customerMock]);
    });
  });

  describe("Get Customer Function", () => {
    it("Should throw an Error when an exception was catched", async () => {
      jest.spyOn(repository, "get").mockRejectedValue(new Error("some_error"));

      const promise = sut.get("some_id");

      await expect(promise).rejects.toThrow("some_error");
    });

    it("Should get a Customer", async () => {
      jest.spyOn(repository, "get").mockResolvedValue(customerMock);

      const actual = await sut.get("some_id");

      expect(actual).toStrictEqual(customerMock);
    });
  });

  describe("Update Customer Function", () => {
    it("Should throw an Error when an exception was catched", async () => {
      jest
        .spyOn(repository, "update")
        .mockRejectedValue(new Error("some_error"));

      const promise = sut.update(updateCustomerMock);

      await expect(promise).rejects.toThrow("some_error");
    });

    it("Should update a Customer", async () => {
      jest.spyOn(repository, "update").mockResolvedValue(customerMock);

      const actual = await sut.update(updateCustomerMock);

      expect(actual).toStrictEqual(customerMock);
    });
  });

  describe("Delete Customer Function", () => {
    it("Should throw an Error when an exception was catched", async () => {
      jest
        .spyOn(repository, "delete")
        .mockRejectedValue(new Error("some_error"));

      const promise = sut.delete("some_id");

      await expect(promise).rejects.toThrow("some_error");
    });

    it("Should delete a Customer", async () => {
      const spy = jest.spyOn(repository, "delete").mockResolvedValue();

      await sut.delete("some_id");

      expect(spy).toHaveBeenCalled();
    });
  });
});
