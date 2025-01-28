import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DbConfig } from "../domain/interfaces/db.interface";

class DynamoDBClientSingleton {
  private static instance: DynamoDBClient;

  private constructor() {}

  public static getInstance(config: DbConfig): DynamoDBClient {
    const params = {
      region: process.env.AWS_REGION || config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fakeMyKeyId",
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY || "fakeSecretAccessKey",
      },
    };

    if (!DynamoDBClientSingleton.instance) {
      DynamoDBClientSingleton.instance = new DynamoDBClient(params);
    }
    return DynamoDBClientSingleton.instance;
  }
}

export default DynamoDBClientSingleton;
