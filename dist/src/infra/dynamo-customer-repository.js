"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoCustomerRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const crypto_1 = require("crypto");
class DynamoCustomerRepository {
    constructor(client) {
        this.client = client;
        this.tableName = process.env.DYNAMODB_TABLE_NAME || "Customers";
    }
    async list(params) {
        var _a;
        const { search, fullName, status, addresses, ids, document } = params;
        const filterExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
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
            filterExpressions.push(`#id IN (${ids.map((_, i) => `:id${i}`).join(", ")})`);
            expressionAttributeNames["#id"] = "id";
            ids.forEach((id, i) => {
                expressionAttributeValues[`:id${i}`] = { S: id };
            });
        }
        if (search) {
            filterExpressions.push("contains(#fullName, :search) OR contains(#document, :search)");
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
        const filterExpression = filterExpressions.length > 0
            ? filterExpressions.join(" AND ")
            : undefined;
        const command = new client_dynamodb_1.ScanCommand({
            TableName: this.tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0
                ? expressionAttributeNames
                : undefined,
            ExpressionAttributeValues: Object.keys(expressionAttributeValues).length > 0
                ? expressionAttributeValues
                : undefined,
        });
        const result = await this.client.send(command);
        if (!((_a = result.Items) === null || _a === void 0 ? void 0 : _a.length))
            return [];
        const customers = result.Items.map((item) => {
            return this.mapCustomerResponse(item);
        });
        return customers;
    }
    async get(id) {
        const command = new client_dynamodb_1.GetItemCommand({
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
    async getByDocument(document) {
        const command = new client_dynamodb_1.QueryCommand({
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
    async create(data) {
        var _a;
        console.log("DynamoCustomerRepository :: Create");
        const now = new Date().toISOString();
        const id = (_a = data.id) !== null && _a !== void 0 ? _a : (0, crypto_1.randomUUID)();
        Object.assign(data, {
            createdAt: now,
            updatedAt: now,
            id,
        });
        const params = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(data),
            ReturnValue: "ALL_NEW",
        };
        const command = new client_dynamodb_1.PutItemCommand(params);
        const result = await this.client.send(command);
        console.log("DynamoCustomerRepository :: Create :: Success");
        if (result.Attributes) {
            return (0, util_dynamodb_1.unmarshall)(result.Attributes);
        }
        return null;
    }
    async update(data) {
        console.log("DynamoCustomerRepository :: Update");
        const now = new Date().toISOString();
        const params = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ id: data.id }),
            UpdateExpression: "SET #status = :status, addresses = :addresses, contacts = :contacts, updatedAt = :updatedAt",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ":status": data.status,
                ":addresses": data.addresses,
                ":contacts": data.contacts,
                ":updatedAt": now,
            }),
            ReturnValue: "ALL_NEW",
        };
        const command = new client_dynamodb_1.UpdateItemCommand(params);
        const result = await this.client.send(command);
        console.log("DynamoCustomerRepository :: Update :: Success");
        if (result.Attributes) {
            return (0, util_dynamodb_1.unmarshall)(result.Attributes);
        }
        return null;
    }
    async delete(id) {
        console.log("DynamoCustomerRepository :: Delete");
        const command = new client_dynamodb_1.UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                id: { S: id },
            },
            UpdateExpression: "SET isDeleted = :true, deletedAt = :timestamp",
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ":true": true,
                ":timestamp": new Date().toISOString(),
            }),
        });
        await this.client.send(command);
        console.log("DynamoCustomerRepository :: Delete :: Success");
    }
    mapCustomerResponse(item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const addresses = (_b = (_a = item === null || item === void 0 ? void 0 : item.addressess) === null || _a === void 0 ? void 0 : _a.L) === null || _b === void 0 ? void 0 : _b.map((address) => {
            return address.M ? (0, util_dynamodb_1.unmarshall)(address.M) : [];
        });
        const contacts = (_d = (_c = item === null || item === void 0 ? void 0 : item.contacts) === null || _c === void 0 ? void 0 : _c.L) === null || _d === void 0 ? void 0 : _d.map((contact) => {
            return contact.M ? (0, util_dynamodb_1.unmarshall)(contact.M) : [];
        });
        return {
            id: (_e = item.id) === null || _e === void 0 ? void 0 : _e.S,
            birthDate: (_f = item.birthDate) === null || _f === void 0 ? void 0 : _f.S,
            fullName: (_g = item.fullName) === null || _g === void 0 ? void 0 : _g.S,
            status: (_h = item.status) === null || _h === void 0 ? void 0 : _h.S,
            addresses,
            contacts,
            isDeleted: ((_j = item.isDeleted) === null || _j === void 0 ? void 0 : _j.BOOL) || false,
            document: (_k = item.document) === null || _k === void 0 ? void 0 : _k.S,
        };
    }
}
exports.DynamoCustomerRepository = DynamoCustomerRepository;
