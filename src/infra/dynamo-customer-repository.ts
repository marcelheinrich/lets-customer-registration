import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { CustomerRepository } from "../domain/repositories/customer.repository";
import {
  Address,
  Contacts,
  Customer,
} from "../domain/entities/customer.entity";
import {
  CreateCustomerParams,
  ListCustomersParams,
  UpdateCustomerParams,
} from "../domain/interfaces/customer.interface";
import { CustomerStatus } from "../domain/enums/customer.enum";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

export class DynamoCustomerRepository implements CustomerRepository {
  tableName: string;

  constructor(private readonly client: DynamoDBClient) {
    this.tableName = process.env.DYNAMODB_TABLE_NAME || "Customers";
  }

  async list(params: ListCustomersParams): Promise<Array<Customer> | []> {
    const { search, fullName, status, addresses, ids, document } = params;

    const filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, AttributeValue> = {};

    if (fullName) {
      filterExpressions.push("#fullName = :fullName");
      expressionAttributeNames["#fullName"] = "fullName";
      expressionAttributeValues[":fullName"] = { S: fullName };
    }

    if (status) {
      filterExpressions.push("#status = :status");
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = { S: status };
    }

    if (ids && ids.length > 0) {
      filterExpressions.push(
        `#id IN (${ids.map((_, i) => `:id${i}`).join(", ")})`
      );
      expressionAttributeNames["#id"] = "id";
      ids.forEach((id, i) => {
        expressionAttributeValues[`:id${i}`] = { S: id };
      });
    }

    if (search) {
      filterExpressions.push(
        "contains(#fullName, :search) OR contains(#document, :search)"
      );
      expressionAttributeNames["#fullName"] = "fullName";
      expressionAttributeNames["#document"] = "document";
      expressionAttributeValues[":search"] = { S: search };
    }

    if (addresses && addresses.length > 0) {
      addresses.forEach((address, index) => {
        const addressKey = `:address${index}`;
        filterExpressions.push(`contains(#addresses, ${addressKey})`);
        expressionAttributeNames["#addresses"] = "addresses";
        expressionAttributeValues[addressKey] = { S: JSON.stringify(address) };
      });
    }

    if (document) {
      filterExpressions.push("#document = :document");
      expressionAttributeNames["#document"] = "document";
      expressionAttributeValues[":document"] = { S: document };
    }

    const filterExpression =
      filterExpressions.length > 0
        ? filterExpressions.join(" AND ")
        : undefined;

    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0
          ? expressionAttributeNames
          : undefined,
      ExpressionAttributeValues:
        Object.keys(expressionAttributeValues).length > 0
          ? expressionAttributeValues
          : undefined,
    });

    const result = await this.client.send(command);

    if (!result.Items?.length) return [];

    const customers = result.Items.map((item) => {
      return this.mapCustomerResponse(item);
    });

    return customers;
  }

  async get(id: string): Promise<Customer | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    });

    const result = await this.client.send(command);

    if (!result.Item) {
      return null;
    }

    const customer = result.Item;
    return this.mapCustomerResponse(customer);
  }

  async getByDocument(document: string): Promise<Customer | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "DocumentIndex",
      KeyConditionExpression: "#document = :document",
      ExpressionAttributeNames: {
        "#document": "document",
      },
      ExpressionAttributeValues: {
        ":document": { S: document },
      },
    });

    const result = await this.client.send(command);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const customer = result.Items[0];
    return this.mapCustomerResponse(customer);
  }

  async create(data: CreateCustomerParams): Promise<Customer | null> {
    console.log("DynamoCustomerRepository :: Create");

    const now = new Date().toISOString();
    const id = data.id ?? randomUUID();

    Object.assign(data, {
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      id,
    });

    const params = {
      TableName: this.tableName,
      Item: marshall(data),
      ReturnValue: "ALL_NEW",
    };

    const command = new PutItemCommand(params);

    const result = await this.client.send(command);

    console.log("DynamoCustomerRepository :: Create :: Success");

    if (result.Attributes) {
      return unmarshall(result.Attributes) as Customer;
    }

    return null;
  }

  async update(data: UpdateCustomerParams): Promise<Customer | null> {
    console.log("DynamoCustomerRepository :: Update");

    const now = new Date().toISOString();

    const params = {
      TableName: this.tableName,
      Key: marshall({ id: data.id }),
      UpdateExpression:
        "SET #status = :status, addresses = :addresses, contacts = :contacts, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: marshall({
        ":status": data.status,
        ":addresses": data.addresses,
        ":contacts": data.contacts,
        ":updatedAt": now,
      }),
      ReturnValue: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);

    const result = await this.client.send(command);

    console.log("DynamoCustomerRepository :: Update :: Success");

    if (result.Attributes) {
      return unmarshall(result.Attributes) as Customer;
    }

    return null;
  }

  async delete(id: string): Promise<void> {
    console.log("DynamoCustomerRepository :: Delete");

    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
      UpdateExpression: "SET isDeleted = :true, deletedAt = :timestamp",
      ExpressionAttributeValues: marshall({
        ":true": true,
        ":timestamp": new Date().toISOString(),
      }),
    });

    await this.client.send(command);

    console.log("DynamoCustomerRepository :: Delete :: Success");
  }

  private mapCustomerResponse(item: Record<string, AttributeValue>) {
    const addresses = item?.addresses?.L?.map((address: AttributeValue) => {
      return address.M ? unmarshall(address.M) : [];
    }) as Address[];

    const contacts = item?.contacts?.L?.map((contact: AttributeValue) => {
      return contact.M ? unmarshall(contact.M) : [];
    }) as Contacts[];

    return {
      id: item.id?.S as string,
      birthDate: item.birthDate?.S as string,
      fullName: item.fullName?.S as string,
      status: item.status?.S as CustomerStatus,
      addresses,
      contacts,
      isDeleted: item.isDeleted?.BOOL || false,
      document: item.document?.S as string,
    };
  }
}
