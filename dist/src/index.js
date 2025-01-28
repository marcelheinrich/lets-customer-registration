"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const normalize_params_1 = require("./domain/middlewares/normalize-params");
const customer_service_1 = require("./domain/services/customer.service");
const dynamo_customer_repository_1 = require("./infra/dynamo-customer-repository");
const dynamo_singleton_1 = __importDefault(require("./utils/dynamo.singleton"));
const http_enum_1 = require("./domain/enums/http.enum");
const http_response_1 = require("./utils/http-response");
const create_1 = require("./handlers/create");
const list_1 = require("./handlers/list");
const update_1 = require("./handlers/update");
const delete_1 = require("./handlers/delete");
const config_1 = require("./config");
const isLocal = config_1.config.IS_OFFLINE;
const dependencies = isLocal
    ? { region: config_1.config.NODE_ENV, endpoint: config_1.config.DB_HOST_LOCAL }
    : {};
const dynamoClient = dynamo_singleton_1.default.getInstance(dependencies);
const repository = new dynamo_customer_repository_1.DynamoCustomerRepository(dynamoClient);
const service = new customer_service_1.CustomerService(repository);
const handler = async (event) => {
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : null;
    const pathParams = event.pathParameters || {};
    const queryParams = event.queryStringParameters || {};
    try {
        switch (method) {
            case "POST":
                return handlePost(body);
            case "GET":
                return handleGet(queryParams);
            case "PUT":
                return handlePut(body, pathParams);
            case "DELETE":
                return handleDelete(pathParams);
            default:
                return (0, http_response_1.httpResponse)({ message: "Method not configured" }, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
    catch (error) {
        return (0, http_response_1.httpResponse)({ message: error }, http_enum_1.HttpStatusCode.SERVER_ERROR);
    }
};
exports.handler = handler;
const handlePost = async (body) => {
    if (!body)
        throw new Error("Missing parameters.");
    (0, normalize_params_1.normalizeCreate)(body);
    const createUsecase = new create_1.CreateCustomer(service);
    return createUsecase.execute(body);
};
const handleGet = async (queryParams) => {
    (0, normalize_params_1.normalizeList)(queryParams);
    const listUsecase = new list_1.ListCustomers(service);
    return listUsecase.execute(queryParams);
};
const handlePut = async (body, pathParams) => {
    if (!pathParams.id)
        throw new Error("Path property Id is required.");
    (0, normalize_params_1.normalizeUpdate)(body);
    const params = {
        ...body,
        id: pathParams.id,
    };
    const updateUsecase = new update_1.UpdateCustomer(service);
    return updateUsecase.execute(params);
};
const handleDelete = async (pathParams) => {
    if (!pathParams.id) {
        throw new Error("Path property Id is required");
    }
    const deleteUsecase = new delete_1.DeleteCustomer(service);
    return deleteUsecase.execute(pathParams.id);
};
