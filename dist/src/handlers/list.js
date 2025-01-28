"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomers = void 0;
const http_enum_1 = require("../domain/enums/http.enum");
const http_response_1 = require("../utils/http-response");
class ListCustomers {
    constructor(service) {
        this.service = service;
    }
    async execute(params) {
        if (params.ids) {
            params.ids = Array.isArray(params.ids) ? params.ids : [params.ids];
        }
        try {
            const customers = await this.service.list(params);
            console.log("ListCustomersLambda :: handler :: Success");
            if (!customers.length) {
                return (0, http_response_1.httpResponse)({ message: "No Customers found." }, http_enum_1.HttpStatusCode.NOT_FOUND);
            }
            const response = (0, http_response_1.httpResponse)(customers, http_enum_1.HttpStatusCode.OK);
            console.log(response);
            return response;
        }
        catch (error) {
            console.error("ListCustomersLambda :: handler :: exception", error);
            return (0, http_response_1.httpResponse)(error, http_enum_1.HttpStatusCode.BAD_REQUEST);
        }
    }
}
exports.ListCustomers = ListCustomers;
