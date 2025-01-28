"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomer = void 0;
const http_enum_1 = require("../domain/enums/http.enum");
const http_response_1 = require("../utils/http-response");
class UpdateCustomer {
    constructor(service) {
        this.service = service;
    }
    async execute(params) {
        console.log("UpdateCustomerLambda :: handler");
        try {
            const customerUpdated = await this.service.update(params);
            console.log("UpdateCustomerLambda :: handler :: Success");
            if (!customerUpdated) {
                return (0, http_response_1.httpResponse)({ message: "Server Error" }, http_enum_1.HttpStatusCode.SERVER_ERROR);
            }
            return (0, http_response_1.httpResponse)(customerUpdated, http_enum_1.HttpStatusCode.OK);
        }
        catch (error) {
            console.error("UpdateCustomerLambda :: handler :: exception", error);
            return (0, http_response_1.httpResponse)(error, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
}
exports.UpdateCustomer = UpdateCustomer;
