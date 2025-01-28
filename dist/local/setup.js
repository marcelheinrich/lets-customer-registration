"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynamo_singleton_1 = __importDefault(require("../src/utils/dynamo.singleton"));
const config_1 = require("../src/config");
class Setup {
    static async run() {
        var _a;
        const client = dynamo_singleton_1.default.getInstance({
            region: config_1.config.NODE_ENV,
            endpoint: config_1.config.DB_HOST_LOCAL,
        });
        const params = {
            TableName: "Customers",
            KeySchema: [{ AttributeName: "id", KeyType: client_dynamodb_1.KeyType.HASH }],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: client_dynamodb_1.ScalarAttributeType.S },
                { AttributeName: "document", AttributeType: client_dynamodb_1.ScalarAttributeType.S },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            GlobalSecondaryIndexes: [
                {
                    IndexName: "DocumentIndex",
                    KeySchema: [
                        { AttributeName: "document", KeyType: client_dynamodb_1.KeyType.HASH },
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
            const list = await client.send(new client_dynamodb_1.ListTablesCommand());
            if ((_a = list.TableNames) === null || _a === void 0 ? void 0 : _a.includes("Customers")) {
                return;
            }
            const data = await client.send(new client_dynamodb_1.CreateTableCommand(params));
            console.log("Table creation successful:", JSON.stringify(data.TableDescription, null, 2));
        }
        catch (err) {
            console.error("Error creating table:", JSON.stringify(err, null, 2));
        }
    }
}
exports.Setup = Setup;
