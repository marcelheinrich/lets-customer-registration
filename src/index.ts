import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CreateCustomerParams,
  ListCustomersParams,
  UpdateCustomerParams,
} from "./domain/interfaces/customer.interface";
import { normalizeCreate, normalizeList, normalizeUpdate } from "./domain/middlewares/normalize-params";
import { CustomerService } from "./domain/services/customer.service";
import { DynamoCustomerRepository } from "./infra/dynamo-customer-repository";
import DynamoDBClientSingleton from "./utils/dynamo.singleton";
import { HttpStatusCode } from "./domain/enums/http.enum";
import { httpResponse } from "./utils/http-response";
import { CreateCustomer } from "./handlers/create";
import { ListCustomers } from "./handlers/list";
import { UpdateCustomer } from "./handlers/update";
import { DeleteCustomer } from "./handlers/delete";
import { config } from "./config";

const isLocal = config.IS_OFFLINE;
const dependencies = isLocal
  ? { region: config.NODE_ENV, endpoint: config.DB_HOST_LOCAL }
  : {};

const dynamoClient = DynamoDBClientSingleton.getInstance(dependencies);
const repository = new DynamoCustomerRepository(dynamoClient);
const service = new CustomerService(repository);

export const handler: APIGatewayProxyHandler = async (event) => {
  const method = event.httpMethod;
  const body: unknown = event.body ? JSON.parse(event.body) : null;
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
        return httpResponse(
          { message: "Method not configured" },
          HttpStatusCode.BAD_REQUEST
        );
    }
  } catch (error) {
    return httpResponse({ message: error }, HttpStatusCode.SERVER_ERROR);
  }
};

const handlePost = async (body: unknown) => {
  if (!body) throw new Error("Missing parameters.");

  normalizeCreate(body as CreateCustomerParams);

  const createUsecase = new CreateCustomer(service);

  return createUsecase.execute(body as CreateCustomerParams);
};

const handleGet = async (queryParams: unknown) => {
  normalizeList(queryParams as ListCustomersParams);

  const listUsecase = new ListCustomers(service);

  return listUsecase.execute(queryParams as ListCustomersParams);
};

const handlePut = async (body: unknown, pathParams: { id?: string }) => {
  if (!pathParams.id) throw new Error("Path property Id is required.");

  normalizeUpdate(body as UpdateCustomerParams);

  const params = {
    ...(body as Partial<UpdateCustomerParams>),
    id: pathParams.id,
  } as UpdateCustomerParams;

  const updateUsecase = new UpdateCustomer(service);

  return updateUsecase.execute(params);
};

const handleDelete = async (pathParams: { id?: string }) => {
  if (!pathParams.id) {
    throw new Error("Path property Id is required");
  }

  const deleteUsecase = new DeleteCustomer(service);

  return deleteUsecase.execute(pathParams.id);
};
