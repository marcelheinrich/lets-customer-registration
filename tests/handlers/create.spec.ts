import { HttpStatusCode } from "../../src/domain/enums/http.enum";
import { CustomerService } from "../../src/domain/interfaces/customer.interface";
import { CreateCustomer } from "../../src/handlers/create";
import { createCustomerMock, customerMock } from "../mocks/customer.mock";

describe("CreateCustomer Usecase", () => {
  let sut: CreateCustomer;
  let service: jest.Mocked<CustomerService>;

  beforeEach(() => {
    service = {
      delete: jest.fn(),
      list: jest.fn(),
      register: jest.fn(),
      update: jest.fn(),
      get: jest.fn()
    };

    sut = new CreateCustomer(service);
  });

  it("Should create a new Customer", async () => {
    jest.spyOn(service, "register").mockResolvedValue(customerMock);

    const actual = await sut.execute(createCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify(customerMock),
      statusCode: HttpStatusCode.CREATED,
    });
  });

  it("Should return server error", async () => {
    jest
      .spyOn(service, "register")
      .mockResolvedValue({ ...customerMock, status: null });

    const actual = await sut.execute(createCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify({ message: "Server Error" }),
      statusCode: HttpStatusCode.SERVER_ERROR,
    });
  });

  it("Should return bad request when something got wrong", async () => {
    jest.spyOn(service, "register").mockRejectedValue(new Error("Some_Error"));

    const actual = await sut.execute(createCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify(new Error("Some_Error")),
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });
});
