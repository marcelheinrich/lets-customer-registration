"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const createCustomerMock = __importStar(require("../events/create-customer-event.json"));
const listCustomersMock = __importStar(require("../events/list-customers-event.json"));
const updateCustomersMock = __importStar(require("../events/update-customer-event.json"));
const getCustomerMock = __importStar(require("../events/get-customer-event.json"));
const deleteCustomerMock = __importStar(require("../events/delete-customer-event.json"));
const setup_1 = require("../local/setup");
var EventType;
(function (EventType) {
    EventType["CREATE"] = "create";
    EventType["LIST"] = "list";
    EventType["UPDATE"] = "update";
    EventType["GET"] = "get";
    EventType["DELETE"] = "delete";
})(EventType || (EventType = {}));
class LocalTest {
    async execute() {
        console.log({ process: process.env });
        const eventType = process.env.EVENT_TYPE || EventType.LIST;
        const mockContext = {
            callbackWaitsForEmptyEventLoop: false,
            functionName: "mockFunctionName",
            functionVersion: "1.0",
            invokedFunctionArn: "arn:aws:lambda:region:account-id:function:mockFunction",
            memoryLimitInMB: "128",
            awsRequestId: "mockAwsRequestId",
            logGroupName: "mockLogGroupName",
            logStreamName: "mockLogStreamName",
            getRemainingTimeInMillis: () => 10000,
            done: () => { },
            fail: () => { },
            succeed: () => { },
        };
        await setup_1.Setup.run();
        let eventMock;
        switch (eventType) {
            case EventType.CREATE:
                eventMock = createCustomerMock;
                break;
            case EventType.UPDATE:
                eventMock = updateCustomersMock;
                break;
            case EventType.GET:
                eventMock = getCustomerMock;
                break;
            case EventType.DELETE:
                eventMock = deleteCustomerMock;
                break;
            case EventType.LIST:
                eventMock = listCustomersMock;
                break;
            default:
                throw new Error('Method not implemented');
        }
        await (0, index_1.handler)(eventMock, mockContext, () => { });
    }
}
new LocalTest().execute();
