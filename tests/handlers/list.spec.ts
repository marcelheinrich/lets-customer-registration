import { CustomerService } from "../../src/domain/interfaces/customer.interface";
import { ListCustomers } from "../../src/handlers/list";
import {
  dynamoListingCustomers,
  listedCustomersMock,
} from "../mocks/customer.mock";
import { HttpStatusCode } from "../../src/domain/enums/http.enum";

describe("ListCustomer Usecase", () => {
  let sut: ListCustomers;
  let service: jest.Mocked<CustomerService>;

  beforeEach(() => {
    service = {
      delete: jest.fn(),
      list: jest.fn(),
      register: jest.fn(),
      update: jest.fn(),
      get: jest.fn(),
    };

    sut = new ListCustomers(service);
  });

  it("Should list the customers", async () => {
    jest.spyOn(service, "list").mockResolvedValue([listedCustomersMock]);

    const actual = await sut.execute(dynamoListingCustomers);

    expect(actual).toStrictEqual({
      body: JSON.stringify([listedCustomersMock]),
      statusCode: HttpStatusCode.OK,
    });
  });

  it("Should list the customers with id as string", async () => {
    jest.spyOn(service, "list").mockResolvedValue([listedCustomersMock]);

    const actual = await sut.execute({...dynamoListingCustomers, ids: '1' as any});

    expect(actual).toStrictEqual({
      body: JSON.stringify([listedCustomersMock]),
      statusCode: HttpStatusCode.OK,
    });
  });


  it("Should return server error", async () => {
    jest.spyOn(service, "list").mockResolvedValue([]);

    const actual = await sut.execute(dynamoListingCustomers);

    expect(actual).toStrictEqual({
      body: JSON.stringify({ message: "No Customers found." }),
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  });

  it("Should return bad request when something got wrong", async () => {
    jest.spyOn(service, "register").mockRejectedValue(new Error("Some_Error"));

    const actual = await sut.execute(dynamoListingCustomers);

    expect(actual).toStrictEqual({
      body: JSON.stringify(new Error("Some_Error")),
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });
});
