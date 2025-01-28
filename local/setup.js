"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",
});
const params = {
    TableName: "Customers",
    KeySchema: [{ AttributeName: "id", KeyType: client_dynamodb_1.KeyType.HASH }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: client_dynamodb_1.ScalarAttributeType.S }],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};
const run = async () => {
    try {
        const data = await client.send(new client_dynamodb_1.CreateTableCommand(params));
        console.log("Created table.", JSON.stringify(data, null, 2));
    }
    catch (err) {
        console.error("Error JSON.", JSON.stringify(err, null, 2));
    }
};
run();
