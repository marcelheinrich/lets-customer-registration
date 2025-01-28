import { HttpStatusCode } from "../../src/domain/enums/http.enum";
import { CustomerService } from "../../src/domain/interfaces/customer.interface";
import { DeleteCustomer } from "../../src/handlers/delete";

describe("Delete Usecase", () => {
  let sut: DeleteCustomer;
  let service: jest.Mocked<CustomerService>;

  beforeEach(() => {
    service = {
      delete: jest.fn(),
      list: jest.fn(),
      register: jest.fn(),
      update: jest.fn(),
      get: jest.fn(),
    };

    sut = new DeleteCustomer(service);
  });

  it("Should delete a customer", async () => {
    jest.spyOn(service, "delete").mockResolvedValue();

    const actual = await sut.execute("id");

    expect(actual).toStrictEqual({
      statusCode: HttpStatusCode.NO_CONTENT,
      body: JSON.stringify({ message: "Customer has been deleted." }),
    });
  });

  it("Should return bad request when something got wrong", async () => {
    jest.spyOn(service, "delete").mockRejectedValue(new Error("Some_Error"));

    const actual = await sut.execute("id");

    expect(actual).toStrictEqual({
      body: JSON.stringify(new Error("Some_Error")),
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });
});
