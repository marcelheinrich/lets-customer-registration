import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "./index";
import * as createCustomerMock from "../events/create-customer-event.json";
import * as listCustomersMock from "../events/list-customers-event.json";
import * as updateCustomersMock from "../events/update-customer-event.json";
import * as getCustomerMock from '../events/get-customer-event.json';
import * as deleteCustomerMock from '../events/delete-customer-event.json'
import { Setup } from "../local/setup";

enum EventType {
  CREATE = "create",
  LIST = "list",
  UPDATE = "update",
  GET = 'get',
  DELETE = 'delete'
}

class LocalTest {
  async execute() {
    console.log({ process: process.env })

    const eventType: EventType =
      (process.env.EVENT_TYPE as EventType) || EventType.LIST;

    const mockContext: Context = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: "mockFunctionName",
      functionVersion: "1.0",
      invokedFunctionArn:
        "arn:aws:lambda:region:account-id:function:mockFunction",
      memoryLimitInMB: "128",
      awsRequestId: "mockAwsRequestId",
      logGroupName: "mockLogGroupName",
      logStreamName: "mockLogStreamName",
      getRemainingTimeInMillis: () => 10000,
      done: () => {},
      fail: () => {},
      succeed: () => {},
    };

    await Setup.run();

    let eventMock;

    switch (eventType) {
      case EventType.CREATE:
        eventMock = createCustomerMock as unknown as APIGatewayProxyEvent;
        break;
      case EventType.UPDATE:
        eventMock = updateCustomersMock as unknown as APIGatewayProxyEvent;
        break;
      case EventType.GET:
        eventMock = getCustomerMock as unknown as APIGatewayProxyEvent;
        break;
      case EventType.DELETE:
        eventMock = deleteCustomerMock as unknown as APIGatewayProxyEvent;
        break;
      case EventType.LIST:
        eventMock = listCustomersMock as unknown as APIGatewayProxyEvent;
        break;
      default:
        throw new Error('Method not implemented')
    }

    await handler(
      eventMock as unknown as APIGatewayProxyEvent,
      mockContext,
      () => {}
    );
  }
}

new LocalTest().execute();
