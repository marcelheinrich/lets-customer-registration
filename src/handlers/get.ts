import { HttpStatusCode } from "../domain/enums/http.enum";
import { httpResponse } from "../utils/http-response";
import {
  CustomerService,
} from "../domain/interfaces/customer.interface";

export class GetCustomer {
  constructor(private readonly service: CustomerService) {}

  async execute(id: string) {
    try {
      const customer = await this.service.get(id);

      console.log("GetCustomerLambda :: handler :: Success");

      if (!customer) {
        return httpResponse(
          { message: "Customer not found." },
          HttpStatusCode.NOT_FOUND
        );
      }

      const response = httpResponse(customer, HttpStatusCode.OK);

      console.log(response);

      return response;
    } catch (error) {
      console.error("GetCustomerLambda :: handler :: exception", error);

      return httpResponse(error, HttpStatusCode.BAD_REQUEST);
    }
  }
}
