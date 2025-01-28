import { HttpStatusCode } from "../domain/enums/http.enum";
import { CustomerService } from "../domain/interfaces/customer.interface";
import { httpResponse } from "../utils/http-response";

export class DeleteCustomer {
  constructor(private readonly service: CustomerService) {}

  async execute(customerId: string) {
    console.log("DeleteCustomerLambda :: handler");

    try {
      await this.service.delete(customerId);

      console.log("DeleteCustomerLambda :: handler :: Success");

      return httpResponse(
        { message: "Customer has been deleted." },
        HttpStatusCode.NO_CONTENT
      );
    } catch (error) {
      console.error("DeleteCustomerLambda :: handler :: exception", error);

      return httpResponse(error, HttpStatusCode.BAD_REQUEST);
    }
  }
}
