import { DynamoCustomerRepository } from "../../src/infra/dynamo-customer-repository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  createCustomerMock,
  dynamoCreatingCustomer,
  dynamoUpdatedCustomer,
  dynamoUpdatingCustomer,
  listedCustomersMock,
} from "../mocks/customer.mock";
import { CustomerStatus } from "../../src/domain/enums/customer.enum";
import { ListCustomersParams } from "../../src/domain/interfaces/customer.interface";

jest.mock("@aws-sdk/client-dynamodb");

describe("DynamoCustomerRepository", () => {
  let client: DynamoDBClient;
  let repository: DynamoCustomerRepository;

  beforeEach(() => {
    client = new DynamoDBClient({});
    repository = new DynamoCustomerRepository(client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Function", () => {
    it("should create a new customer", async () => {
      const mockResponse = {
        Attributes: marshall(dynamoCreatingCustomer),
      };

      client.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await repository.create(createCustomerMock);

      expect(client.send).toHaveBeenCalled();
      expect(result).toEqual(dynamoCreatingCustomer);
    });

    it("should return null when attributes did not returned", async () => {
      client.send = jest.fn().mockResolvedValue({});

      const result = await repository.create(createCustomerMock);

      expect(client.send).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });

  describe("Update Function", () => {
    it("should update an existing customer", async () => {
      const mockResponse = {
        Attributes: marshall(dynamoUpdatedCustomer),
      };

      client.send = jest.fn().mockResolvedValue(mockResponse);

      const result = await repository.update(dynamoUpdatingCustomer);

      expect(client.send).toHaveBeenCalled();
      expect(result).toEqual(dynamoUpdatedCustomer);
    });

    it("should return null when attributes did not returned", async () => {
      client.send = jest.fn().mockResolvedValue({});

      const result = await repository.update(dynamoUpdatingCustomer);

      expect(client.send).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });

  describe("Delete Function", () => {
    it("should mark a customer as deleted", async () => {
      client.send = jest.fn().mockResolvedValue({});

      await repository.delete("1");

      expect(client.send).toHaveBeenCalled();
    });
  });

  describe("Get Function", () => {
    it("should return a Customer", async () => {
      client.send = jest.fn().mockResolvedValue({
        Item: marshall(listedCustomersMock),
      });

      const actual = await repository.get("1");

      expect(actual).toStrictEqual(listedCustomersMock);
    });

    it("should return null", async () => {
      client.send = jest.fn().mockResolvedValue({});

      const actual = await repository.get("1");

      expect(actual).toStrictEqual(null);
    });
  });

   describe("GetByDocument Function", () => {
     it("should return a Customer", async () => {
       client.send = jest.fn().mockResolvedValue({
         Items: [marshall(listedCustomersMock)],
       });

       const actual = await repository.getByDocument("43225062081");

       expect(actual).toStrictEqual(listedCustomersMock);
     });

     it("should return null", async () => {
       client.send = jest.fn().mockResolvedValue({ something: true });

       const actual = await repository.getByDocument("1");

       expect(actual).toStrictEqual(null);
     });
   });

  describe("List Function", () => {
    it.each([
      [
        { fullName: "John Doe" },
        "#fullName = :fullName",
        { "#fullName": "fullName" },
        { ":fullName": { S: "John Doe" } },
      ],
      [
        { status: CustomerStatus.ACTIVE },
        "#status = :status",
        { "#status": "status" },
        { ":status": { S: CustomerStatus.ACTIVE } },
      ],
      [
        { ids: ["id1", "id2"] },
        "#id IN (:id0, :id1)",
        { "#id": "id" },
        { ":id0": { S: "id1" }, ":id1": { S: "id2" } },
      ],
      [
        { search: "query" },
        "contains(#fullName, :search) OR contains(#document, :search)",
        { "#fullName": "fullName", "#document": "document" },
        { ":search": { S: "query" } },
      ],
      [
        { addresses: [{ street: "Main St", city: "NY" }] },
        "contains(#addresses, :address0)",
        { "#addresses": "addresses" },
        {
          ":address0": {
            S: JSON.stringify({ street: "Main St", city: "NY" }),
          },
        },
      ],
    ])(
      "should construct the correct filter expression for params: %o",
      async (params, expectedFilter, expectedNames, expectedValues) => {
        client.send = jest.fn().mockResolvedValue({
          Items: [
            {
              id: { S: "id1" },
              fullName: { S: "John Doe" },
              status: { S: CustomerStatus.ACTIVE },
              addresses: {
                L: [
                  {
                    M: {
                      street: { S: "Main St" },
                      city: { S: "NY" },
                    },
                  },
                ],
              },
              contacts: {
                L: [
                  {
                    M: {
                      phone: { S: "12345" },
                      email: { S: "contact@example.com" },
                      isMain: { BOOL: true },
                    },
                  },
                ],
              },
              isDeleted: { BOOL: false },
              document: { S: "43225062081" },
            },
          ],
        });

        const result = await repository.list(
          params as unknown as ListCustomersParams
        );

        expect(result).toEqual([
          {
            id: "id1",
            birthDate: undefined,
            fullName: "John Doe",
            status: CustomerStatus.ACTIVE,
            addresses: [{ street: "Main St", city: "NY" }],
            contacts: [
              { phone: "12345", email: "contact@example.com", isMain: true },
            ],
            isDeleted: false,
            document: "43225062081",
          },
        ]);
      }
    );
  });
});
