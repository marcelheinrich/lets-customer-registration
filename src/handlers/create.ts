import { HttpStatusCode } from "../domain/enums/http.enum";
import {
  CreateCustomerParams,
  CustomerService,
} from "../domain/interfaces/customer.interface";
import { httpResponse } from "../utils/http-response";

export class CreateCustomer {
  constructor(private readonly service: CustomerService) {}

  public async execute(params: CreateCustomerParams) {
    console.log("CustomerRegistrationLambda :: handler");

    try {
      const customerCreated = await this.service.register(params);

      console.log("CustomerRegistrationLambda :: handler :: Success");

      if (!customerCreated.status) {
        return httpResponse(
          { message: "Server Error" },
          HttpStatusCode.SERVER_ERROR
        );
      }

      const response = httpResponse(customerCreated, HttpStatusCode.CREATED);

      console.log(customerCreated);

      return response;
    } catch (error) {
      console.error(
        "CustomerRegistrationLambda :: handler :: exception",
        error
      );

      return httpResponse(error, HttpStatusCode.BAD_REQUEST);
    }
  }
}
