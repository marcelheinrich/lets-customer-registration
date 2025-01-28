import { HttpStatusCode } from "../domain/enums/http.enum";
import {
  CustomerService,
  UpdateCustomerParams,
} from "../domain/interfaces/customer.interface";
import { httpResponse } from "../utils/http-response";

export class UpdateCustomer {
  constructor(private readonly service: CustomerService) {}

  async execute(params: UpdateCustomerParams) {
    console.log("UpdateCustomerLambda :: handler");

    try {
      const customerUpdated = await this.service.update(params);

      console.log("UpdateCustomerLambda :: handler :: Success");

      if (!customerUpdated) {
        return httpResponse(
          { message: "Server Error" },
          HttpStatusCode.SERVER_ERROR
        );
      }

      return httpResponse(customerUpdated, HttpStatusCode.OK);
    } catch (error) {
      console.error("UpdateCustomerLambda :: handler :: exception", error);

      return httpResponse(error, HttpStatusCode.BAD_REQUEST);
    }
  }
}
