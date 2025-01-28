"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomer = void 0;
const http_enum_1 = require("../domain/enums/http.enum");
const http_response_1 = require("../utils/http-response");
class GetCustomer {
    constructor(service) {
        this.service = service;
    }
    async execute(id) {
        try {
            const customer = await this.service.get(id);
            console.log("GetCustomerLambda :: handler :: Success");
            if (!customer) {
                return (0, http_response_1.httpResponse)({ message: "Customer not found." }, http_enum_1.HttpStatusCode.NOT_FOUND);
            }
            const response = (0, http_response_1.httpResponse)(customer, http_enum_1.HttpStatusCode.OK);
            console.log(response);
            return response;
        }
        catch (error) {
            console.error("GetCustomerLambda :: handler :: exception", error);
            return (0, http_response_1.httpResponse)(error, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
}
exports.GetCustomer = GetCustomer;
