"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCustomer = void 0;
const http_enum_1 = require("../domain/enums/http.enum");
const http_response_1 = require("../utils/http-response");
class DeleteCustomer {
    constructor(service) {
        this.service = service;
    }
    async execute(customerId) {
        console.log("DeleteCustomerLambda :: handler");
        try {
            await this.service.delete(customerId);
            console.log("DeleteCustomerLambda :: handler :: Success");
            return (0, http_response_1.httpResponse)({ message: "Customer has been deleted." }, http_enum_1.HttpStatusCode.NO_CONTENT);
        }
        catch (error) {
            console.error("DeleteCustomerLambda :: handler :: exception", error);
            return (0, http_response_1.httpResponse)(error, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
}
exports.DeleteCustomer = DeleteCustomer;
