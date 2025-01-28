import { HttpStatusCode } from "../../src/domain/enums/http.enum";
import { CustomerService } from "../../src/domain/interfaces/customer.interface";
import { UpdateCustomer } from "../../src/handlers/update";
import { customerMock, updateCustomerMock } from "../mocks/customer.mock";

describe("UpdateCustomer Usecase", () => {
  let sut: UpdateCustomer;
  let service: jest.Mocked<CustomerService>;

  beforeEach(() => {
    service = {
      delete: jest.fn(),
      list: jest.fn(),
      register: jest.fn(),
      update: jest.fn(),
      get: jest.fn(),
    };

    sut = new UpdateCustomer(service);
  });

  it("Should update a new Customer", async () => {
    jest.spyOn(service, "update").mockResolvedValue({...customerMock, isDeleted: false });

    const actual = await sut.execute(updateCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify(customerMock),
      statusCode: HttpStatusCode.OK,
    });
  });

  it("Should return server error", async () => {
    jest.spyOn(service, "update").mockResolvedValue(null);

    const actual = await sut.execute(updateCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify({ message: "Server Error" }),
      statusCode: HttpStatusCode.SERVER_ERROR,
    });
  });

  it("Should return bad request when something got wrong", async () => {
    jest.spyOn(service, "update").mockRejectedValue(new Error("Some_Error"));

    const actual = await sut.execute(updateCustomerMock);

    expect(actual).toStrictEqual({
      body: JSON.stringify(new Error("Some_Error")),
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });
});
