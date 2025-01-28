"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomer = void 0;
const http_enum_1 = require("../domain/enums/http.enum");
const http_response_1 = require("../utils/http-response");
class CreateCustomer {
    constructor(service) {
        this.service = service;
    }
    async execute(params) {
        console.log("CustomerRegistrationLambda :: handler");
        try {
            const customerCreated = await this.service.register(params);
            console.log("CustomerRegistrationLambda :: handler :: Success");
            if (!customerCreated.status) {
                return (0, http_response_1.httpResponse)({ message: "Server Error" }, http_enum_1.HttpStatusCode.SERVER_ERROR);
            }
            const response = (0, http_response_1.httpResponse)(customerCreated, http_enum_1.HttpStatusCode.CREATED);
            console.log(customerCreated);
            return response;
        }
        catch (error) {
            console.error("CustomerRegistrationLambda :: handler :: exception", error);
            return (0, http_response_1.httpResponse)(error, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
}
exports.CreateCustomer = CreateCustomer;
