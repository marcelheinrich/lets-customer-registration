"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoDBClientSingleton {
    constructor() { }
    static getInstance(config) {
        const params = {
            region: process.env.AWS_REGION || config.region,
            endpoint: config.endpoint,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fakeMyKeyId",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "fakeSecretAccessKey",
            },
        };
        if (!DynamoDBClientSingleton.instance) {
            DynamoDBClientSingleton.instance = new client_dynamodb_1.DynamoDBClient(params);
        }
        return DynamoDBClientSingleton.instance;
    }
}
exports.default = DynamoDBClientSingleton;
