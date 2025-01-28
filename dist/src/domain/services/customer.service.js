"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
class CustomerService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async register(params) {
        var _a;
        console.log("CustomerService:: Register");
        try {
            const exists = await this.customerRepository.get(params.document);
            if (exists)
                throw new Error("Customer already exists");
            const response = await this.customerRepository.create(params);
            console.log("CustomerService:: Register :: Create Success");
            return { status: (_a = response === null || response === void 0 ? void 0 : response.status) !== null && _a !== void 0 ? _a : null };
        }
        catch (error) {
            console.error("CustomerService:: Register :: Exception", error);
            throw error;
        }
    }
    async list(params) {
        console.log("CustomerService:: List");
        try {
            const customers = await this.customerRepository.list(params);
            console.log("CustomerService:: List :: Success");
            return customers;
        }
        catch (error) {
            console.error("CustomerService:: List :: Exception", error);
            throw error;
        }
    }
    async get(id) {
        console.log("CustomerService:: Get");
        try {
            const customer = await this.customerRepository.get(id);
            console.log("CustomerService:: Get :: Success");
            return customer;
        }
        catch (error) {
            console.error("CustomerService:: Get :: Exception", error);
            throw error;
        }
    }
    async update(params) {
        console.log("CustomerService:: Update");
        try {
            const customer = await this.customerRepository.update(params);
            console.log("CustomerService:: Update :: Success");
            return customer;
        }
        catch (error) {
            console.error("CustomerService:: Update :: Exception", error);
            throw error;
        }
    }
    async delete(id) {
        console.log("CustomerService:: Delete");
        try {
            await this.customerRepository.delete(id);
            console.log("CustomerService:: Delete :: Success");
        }
        catch (error) {
            console.error("CustomerService:: Delete :: Exception", error);
            throw error;
        }
    }
}
exports.CustomerService = CustomerService;
