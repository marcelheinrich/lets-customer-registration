import {
  CreateTableCommand,
  ListTablesCommand,
  ScalarAttributeType,
  KeyType,
  CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";

import DynamoDBClientSingleton from "../src/utils/dynamo.singleton";
import { config } from "../src/config";


export class Setup {
  public static async run() {

    const client = DynamoDBClientSingleton.getInstance({
      region: config.NODE_ENV,
      endpoint: config.DB_HOST_LOCAL,
    });

      const params: CreateTableCommandInput = {
        TableName: "Customers",
        KeySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: ScalarAttributeType.S },
          { AttributeName: "document", AttributeType: ScalarAttributeType.S },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        GlobalSecondaryIndexes: [
          {
            IndexName: "DocumentIndex",
            KeySchema: [
              { AttributeName: "document", KeyType: KeyType.HASH }, 
            ],
            Projection: {
              ProjectionType: "ALL", 
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ],
      };


    try {
      const list = await client.send(new ListTablesCommand());

      if (list.TableNames?.includes("Customers")) {
        return;
      }

      const data = await client.send(new CreateTableCommand(params));
      console.log(
        "Table creation successful:",
        JSON.stringify(data.TableDescription, null, 2)
      );
    } catch (err) {
      console.error("Error creating table:", JSON.stringify(err, null, 2));
    }
  }
}
