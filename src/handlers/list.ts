import { HttpStatusCode } from "../domain/enums/http.enum";
import { httpResponse } from "../utils/http-response";
import {
  CustomerService,
  ListCustomersParams,
} from "../domain/interfaces/customer.interface";

export class ListCustomers {
  constructor(private readonly service: CustomerService) {}

  async execute(params: ListCustomersParams) {
    if (params.ids){
      params.ids = Array.isArray(params.ids) ? params.ids : [params.ids];
    }

    try {
      const customers = await this.service.list(params);

      console.log("ListCustomersLambda :: handler :: Success");

      if (!customers.length) {
        return httpResponse(
          { message: "No Customers found." },
          HttpStatusCode.NOT_FOUND
        );
      }

      const response = httpResponse(customers, HttpStatusCode.OK);

      console.log(response);

      return response;
    } catch (error) {
      console.error("ListCustomersLambda :: handler :: exception", error);

      return httpResponse(error, HttpStatusCode.BAD_REQUEST);
    }
  }
}
